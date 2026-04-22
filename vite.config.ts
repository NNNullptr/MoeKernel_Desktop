// vite.config.ts
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { viteComponentMapper } from 'step1-tagger';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    viteComponentMapper(),
    tanstackStart(),
    nitro({
      // 架构变更 2026-04-22：从 deno-deploy 切换为 node-server
      // 构建产物：.output/server/index.mjs，由 PM2 直接启动
      preset: 'node-server',
      output: {
        dir: '.output',
      },
    }),
    // react's vite plugin must come after start's vite plugin
    viteReact(),
    tailwindcss(),
  ],
  build: {
    sourcemap: 'hidden',
    rollupOptions: {
      external(source) {
        if (source.startsWith('node:')) {
          return true;
        }
        return false;
      },
    },
  },
});
