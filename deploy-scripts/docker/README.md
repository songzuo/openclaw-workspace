# Docker 容器部署方案

## 概述

将应用打包成 Docker 镜像，在服务器上运行容器。

## 适用场景

- Node.js/Python/Go 等后端应用
- 需要隔离环境的应用
- 多环境部署（dev/staging/prod）
- 微服务架构

---

## Dockerfile 模板

### Node.js 应用

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# 生产镜像
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/index.js"]
```

### 静态网站（Nginx 容器）

```dockerfile
# Dockerfile
FROM nginx:alpine

# 复制自定义 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY dist/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Python 应用

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
ENV PYTHONUNBUFFERED=1

EXPOSE 8000
CMD ["python", "app.py"]
```

---

## 部署脚本

### build-and-push.sh

```bash
#!/bin/bash
set -e

# 配置
REGISTRY="${REGISTRY:-}"  # 留空则不推送
IMAGE_NAME="${IMAGE_NAME:-myapp}"
TAG="${TAG:-latest}"
DOCKERFILE="${DOCKERFILE:-Dockerfile}"

echo "🐳 开始 Docker 构建..."

# 1. 构建镜像
echo "📦 构建镜像：${IMAGE_NAME}:${TAG}"
docker build -t "${IMAGE_NAME}:${TAG}" -f "${DOCKERFILE}" .

# 2. 推送到 Registry（如果配置了）
if [ -n "${REGISTRY}" ]; then
    echo "📤 推送到 Registry：${REGISTRY}/${IMAGE_NAME}:${TAG}"
    docker tag "${IMAGE_NAME}:${TAG}" "${REGISTRY}/${IMAGE_NAME}:${TAG}"
    docker push "${REGISTRY}/${IMAGE_NAME}:${TAG}"
fi

echo "✅ 构建完成！"
```

### deploy-docker.sh

```bash
#!/bin/bash
set -e

# 配置
DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_HOST="${DEPLOY_HOST:?请设置 DEPLOY_HOST}"
APP_NAME="${APP_NAME:-myapp}"
IMAGE_NAME="${IMAGE_NAME:-myapp}"
TAG="${TAG:-latest}"
CONTAINER_PORT="${CONTAINER_PORT:-3000}"
HOST_PORT="${HOST_PORT:-80}"

echo "🐳 开始 Docker 部署..."

# 1. 导出镜像并传输到服务器
echo "📦 导出镜像..."
docker save "${IMAGE_NAME}:${TAG}" | gzip > /tmp/${APP_NAME}.tar.gz

echo "📤 传输镜像到服务器..."
scp -o StrictHostKeyChecking=no \
    /tmp/${APP_NAME}.tar.gz \
    "${DEPLOY_USER}@${DEPLOY_HOST}:/tmp/"

# 2. 在服务器上部署
echo "🚀 在服务器上部署..."
ssh -o StrictHostKeyChecking=no "${DEPLOY_USER}@${DEPLOY_HOST}" << 'ENDSSH'
#!/bin/bash
set -e

APP_NAME="${APP_NAME}"
CONTAINER_PORT="${CONTAINER_PORT}"
HOST_PORT="${HOST_PORT}"

# 加载镜像
echo "📥 加载镜像..."
gunzip -c /tmp/${APP_NAME}.tar.gz | docker load

# 停止旧容器
echo "🛑 停止旧容器..."
docker stop ${APP_NAME} 2>/dev/null || true
docker rm ${APP_NAME} 2>/dev/null || true

# 运行新容器
echo "🏃 启动新容器..."
docker run -d \
    --name ${APP_NAME} \
    --restart unless-stopped \
    -p ${HOST_PORT}:${CONTAINER_PORT} \
    -e NODE_ENV=production \
    --log-opt max-size=10m \
    --log-opt max-file=3 \
    ${IMAGE_NAME}:${TAG}

# 清理
rm /tmp/${APP_NAME}.tar.gz

# 显示状态
echo "📊 容器状态:"
docker ps | grep ${APP_NAME}
ENDSSH

# 3. 清理本地临时文件
rm -f /tmp/${APP_NAME}.tar.gz

echo "✅ Docker 部署完成！"
echo "🌐 访问地址：http://${DEPLOY_HOST}:${HOST_PORT}"
```

---

## Docker Compose 部署

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    image: myapp:latest
    container_name: myapp
    restart: unless-stopped
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    volumes:
      - app-data:/app/data
      - ./logs:/app/logs
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    container_name: myapp-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    networks:
      - app-network

volumes:
  app-data:

networks:
  app-network:
    driver: bridge
```

### docker-compose 部署脚本

```bash
#!/bin/bash
set -e

DEPLOY_HOST="${DEPLOY_HOST:?请设置 DEPLOY_HOST}"

echo "🐳 开始 Docker Compose 部署..."

# 1. 传输文件
echo "📤 传输文件到服务器..."
scp -o StrictHostKeyChecking=no \
    docker-compose.yml \
    Dockerfile \
    nginx.conf \
    "${DEPLOY_HOST}:/opt/myapp/"

# 2. 在服务器上部署
echo "🚀 在服务器上部署..."
ssh -o StrictHostKeyChecking=no "${DEPLOY_HOST}" << 'ENDSSH'
#!/bin/bash
set -e

cd /opt/myapp

# 停止旧服务
docker-compose down || true

# 构建并启动
docker-compose build
docker-compose up -d

# 显示状态
docker-compose ps
ENDSSH

echo "✅ Docker Compose 部署完成！"
```

---

## 自建 Docker Registry（可选）

### 部署私有 Registry

```bash
# 在服务器上运行 Registry
docker run -d \
  --restart=unless-stopped \
  --name registry \
  -p 5000:5000 \
  -v /data/registry:/var/lib/registry \
  registry:2
```

### 配置 Docker 客户端

```bash
# 配置 Docker 信任私有 Registry
# /etc/docker/daemon.json
{
  "insecure-registries": ["your-server-ip:5000"]
}

# 重启 Docker
systemctl restart docker
```

### 推送到私有 Registry

```bash
# 标记镜像
docker tag myapp:latest your-server-ip:5000/myapp:latest

# 推送
docker push your-server-ip:5000/myapp:latest
```

---

## 使用步骤

### 1. 准备 Dockerfile

根据应用类型选择合适的 Dockerfile 模板。

### 2. 本地构建测试

```bash
docker build -t myapp:latest .
docker run -p 3000:3000 myapp:latest
```

### 3. 部署到服务器

```bash
# 设置环境变量
export DEPLOY_HOST="your.server.ip"
export APP_NAME="myapp"
export IMAGE_NAME="myapp"

# 执行部署
./build-and-push.sh
./deploy-docker.sh
```

---

## 监控和维护

### 查看日志

```bash
# 实时日志
docker logs -f myapp

# 最近 100 行
docker logs --tail 100 myapp
```

### 容器管理

```bash
# 查看运行状态
docker ps

# 进入容器
docker exec -it myapp sh

# 重启容器
docker restart myapp

# 停止容器
docker stop myapp
```

### 清理资源

```bash
# 清理悬空镜像
docker image prune -f

# 清理所有未使用资源
docker system prune -f
```

---

## 安全建议

1. 使用非 root 用户运行容器
2. 定期更新基础镜像
3. 扫描镜像漏洞（docker scan）
4. 限制容器资源（CPU/内存）
5. 使用 Docker secrets 管理敏感信息
6. 配置日志轮转防止磁盘占满
