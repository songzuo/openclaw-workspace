import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { Navigation } from '../components/Navigation';

const inter = Inter({ subsets: ['latin'] });

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
    <html lang="zh-CN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        {/* 跳过导航链接 - 屏幕阅读器专用 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          跳到主要内容
        </a>
        
        <Navigation />
        
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        
        {/* 页脚信息 */}
        <footer className="sr-only" aria-label="网站信息">
          AI 团队实时看板 - 由宋琢环球旅行团队管理
        </footer>
      </body>
    </html>
  );
}
