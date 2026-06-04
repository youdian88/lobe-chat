import { defineConfig } from './src/libs/next/config/define-config';

const isVercel = !!process.env.VERCEL_ENV;

const vercelConfig = {
  // 1. 显式关闭生产环境的 Source Map，斩断打包时的巨量内存开销
  productionBrowserSourceMaps: false,

  // 2. 限制编译时的并发数（用时间换空间），防止多核并行瞬间冲爆 Vercel 内存
  experimental: {
    cpus: 1,              // 强制 Next.js 只使用 1 个 CPU 核心进行构建
    workerThreads: false, // 禁用多线程打包 Worker，转为更省内存的单线程模式
  },

  // Vercel serverless optimization: exclude musl binaries from all routes
  // Vercel uses Amazon Linux (glibc), not Alpine Linux (musl)
  // This saves ~45MB (29MB canvas-musl + 16MB sharp-musl) per serverless function
  outputFileTracingExcludes: {
    '*': [
      'node_modules/.pnpm/@napi-rs+canvas-*-musl*',
      'node_modules/.pnpm/@img+sharp-libvips-*musl*',
      // Exclude SPA/desktop/mobile build artifacts from serverless functions
      'public/_spa/**',
      'dist/desktop/**',
      'dist/mobile/**',
      'apps/desktop/**',
      'packages/database/migrations/**',
    ],
  },
};

const nextConfig = defineConfig({
  ...(isVercel ? vercelConfig : {}),
});

export default nextConfig;
