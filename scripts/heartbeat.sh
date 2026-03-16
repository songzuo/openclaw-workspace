#!/bin/bash
# 24小时不间断工作系统主脚本
# 每15分钟运行一次

WORKSPACE="/root/private_data/openclaw/workspace"
LOG_FILE="$WORKSPACE/logs/heartbeat.log"
MEMORY_FILE="$WORKSPACE/memory/heartbeat-state.json"

mkdir -p "$WORKSPACE/logs"

# 15分钟心跳记录
echo "🫀 $(date '+%Y-%m-%d %H:%M:%S') - 心跳" >> "$LOG_FILE"

# 更新心跳状态
python3 << EOF
import json
import os
from datetime import datetime

state_file = "$MEMORY_FILE"
state = {
    "lastHeartbeat": datetime.now().isoformat(),
    "status": "running",
    "tasks": []
}

if os.path.exists(state_file):
    try:
        with open(state_file) as f:
            state = json.load(f)
    except:
        pass

state["lastHeartbeat"] = datetime.now().isoformat()
state["status"] = "running"

with open(state_file, "w") as f:
    json.dump(state, f, indent=2)

print(f"✅ 心跳更新: {state['lastHeartbeat']}")
EOF

# 检查其他机器状态
cd "$WORKSPACE/botmem-repo" && git pull origin main 2>&1 | tail -3

# 检查待办任务
if [ -f "$WORKSPACE/memory/todo.json" ]; then
    echo "📋 待办任务:"
    cat "$WORKSPACE/memory/todo.json"
fi

echo "✅ 15分钟心跳完成 - $(date)"