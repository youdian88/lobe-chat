import { defineConfig } from './src/libs/next/config/define-config';

const isVercel = !!process.env.VERCEL_ENV;

const vercelConfig = {
  // 👈 在这里加入关闭 Source Map 的配置，降低 Vercel 构建时的内存占用，防止 SIGKILL (137) 错误
  productionBrowserSourceMaps: false,

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
