import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  base: '/my_project/',
  assetsInclude: ['.json', '.md'], // 允许打包 .json 和 .md 文件
  plugins: [
    vue(),
    vueDevTools(),
    visualizer({
      filename: 'stats/stats.html' // 分析报告保存路径
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    rollupOptions: {
      output: {
        // 自定义 chunk 分割规则
        manualChunks: {
          // 把大型库单独打包
          lottie: ['lottie-web'],
          katex: ['katex'],
          elementPlus: ['element-plus'],
          highlightJs: ['highlight.js']
        }
      }
    }
  },
})
