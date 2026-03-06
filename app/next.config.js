/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
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
  trailingSlash: true,
  // 导出静态页面
  output: 'export',
  // 实验性功能
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = nextConfig;
