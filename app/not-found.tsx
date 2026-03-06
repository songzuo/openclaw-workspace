import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center px-4">
        {/* 404 数字动画 */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 leading-none select-none">
            404
          </h1>
          {/* 装饰性圆圈 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[180px] h-[180px] md:w-[240px] md:h-[240px] border-4 border-purple-500/30 rounded-full animate-pulse"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[220px] h-[220px] md:w-[300px] md:h-[300px] border-2 border-pink-500/20 rounded-full"></div>
          </div>
        </div>

        {/* 错误消息 */}
        <h2 className="text-2xl md:text-4xl font-semibold text-white mb-4">
          页面未找到 🚀
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          抱歉，您访问的页面不存在或已被移除。
          让我们带您回到首页吧！
        </p>

        {/* 动画返回按钮 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          返回首页
        </Link>

        {/* 额外装饰：悬浮的星星 */}
        <div className="mt-12 flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: '1.5s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
