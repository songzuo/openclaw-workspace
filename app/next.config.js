const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 性能优化：压缩输出
  compress: true,
  // 图片优化配置
  images: {
    unoptimized: true, // 静态导出时需要
    domains: ['api.dicebear.com', 'avatars.githubusercontent.com', 'github.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache
  },
  // 编译器优化 - 生产环境移除 console
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 安全策略
  poweredByHeader: false,
  // 静态资源优化
  trailingSlash: false,
  // 使用 standalone 输出模式支持 API 路由
  // 如需静态导出，改为 output: 'export'
  output: 'standalone',
  // 实验性功能
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

// Sentry 配置
const sentryWebpackPluginOptions = {
  silent: true, // 安静模式，减少构建日志
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  release: process.env.SENTRY_RELEASE || process.env.npm_package_version,
};

// 使用 withSentryConfig 包装配置
const moduleExports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);

module.exports = moduleExports;