import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { Navigation } from '../components/Navigation';
import { ThemeProvider } from '../components/ThemeProvider';
import { GlobalErrorHandler } from '../components/GlobalErrorHandler';
import ErrorBoundary from '../components/ErrorBoundary';
import { QueryProvider } from '../lib/query';

// 使用 next/font 优化 - 自动优化字体加载
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // 防止字体加载时闪烁
  preload: true,
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://7zi.com'),
  title: {
    default: 'AI 团队实时看板 - 宋琢环球旅行',
    template: '%s | AI 团队实时看板',
  },
  description:
    '实时展示 AI 团队成员状态、任务进度和活动日志。由宋琢环球旅行团队管理，包含 11 个专业 AI 代理协同工作。',
  keywords: ['AI团队看板', '任务管理', '智能体', 'AI代理', '团队协作', '宋琢环球旅行'],
  authors: [{ name: '宋琢环球旅行', url: 'https://7zi.com' }],
  creator: '宋琢环球旅行',
  publisher: '宋琢环球旅行',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // 可访问性元数据
  category: 'business',
  classification: 'AI Team Management',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AI 团队看板',
  },
  // 打开 Graph
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://7zi.com',
    siteName: 'AI 团队实时看板',
    title: 'AI 团队实时看板 - 宋琢环球旅行',
    description: '实时展示 AI 团队成员状态、任务进度和活动日志',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI 团队实时看板',
      },
    ],
  },
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'AI 团队实时看板 - 宋琢环球旅行',
    description: '实时展示 AI 团队成员状态、任务进度和活动日志',
    images: ['/og-image.png'],
  },
  // 搜索引擎
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // 验证
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AI 团队实时看板',
    description: '实时展示 AI 团队成员状态、任务进度和活动日志',
    url: 'https://7zi.com',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    creator: {
      '@type': 'Organization',
      name: '宋琢环球旅行',
      url: 'https://7zi.com',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY',
    },
    featureList: ['实时成员状态展示', '任务进度追踪', '活动日志记录', '11个专业AI代理协同'],
  };

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* 主题脚本 - 防止闪烁 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var resolved = theme;
                  if (!theme || theme === 'system') {
                    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  if (resolved === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* 性能优化：DNS 预取和预连接 */}
        <link rel="dns-prefetch" href="//api.dicebear.com" />
        <link rel="dns-prefetch" href="//avatars.githubusercontent.com" />
        <link rel="dns-prefetch" href="//github.com" />
        <link rel="dns-prefetch" href="//api.github.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.dicebear.com" />
        <link rel="preconnect" href="https://avatars.githubusercontent.com" />
        
        {/* 预加载关键资源 */}
        <link rel="preload" href="/favicon.ico" as="image" />
        
        {/* 结构化数据 - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* 性能监控 (仅生产环境) */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // 性能监控
                window.addEventListener('error', function(e) {
                  if (window.navigator.sendBeacon) {
                    var payload = JSON.stringify({
                      type: 'error',
                      message: e.message,
                      url: window.location.href,
                      timestamp: new Date().toISOString()
                    });
                    window.navigator.sendBeacon('/api/metrics', payload);
                  }
                });
                
                // Core Web Vitals 监控
                if ('PerformanceObserver' in window) {
                  new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                      if (entry.entryType === ' LargestContentfulPaint') {
                        console.log('LCP:', entry.startTime);
                      }
                    }
                  }).observe({ entryTypes: ['largest-contentful-paint'] });
                  
                  new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                      if (entry.entryType === 'First Input') {
                        console.log('FID:', entry.processingStart - entry.startTime);
                      }
                    }
                  }).observe({ entryTypes: ['first-input'] });
                }
              `,
            }}
          />
        )}
      </head>
      <body className={`${inter.className} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors`}>
        {/* 跳过导航链接 - 屏幕阅读器专用 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          跳到主要内容
        </a>
        
        <QueryProvider>
          <ThemeProvider>
            {/* 全局错误处理 */}
            <GlobalErrorHandler>
              {/* 导航组件 */}
              <Navigation />
              
              {/* 主内容区域 - 包含错误边界 */}
              <main id="main-content" tabIndex={-1} className="outline-none">
                <ErrorBoundary name="RootLayout">
                  {children}
                </ErrorBoundary>
              </main>
            </GlobalErrorHandler>
          </ThemeProvider>
        </QueryProvider>
        
        {/* 页脚信息 */}
        <footer className="sr-only" aria-label="网站信息">
          AI 团队实时看板 - 由宋琢环球旅行团队管理
        </footer>
      </body>
    </html>
  );
}
