import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  define: {
    __dirname: '"/"',
  },
  server: {
    proxy: {
      '/s3proxy': {
        target: 'https://pride-frame-images-develop.s3.ap-northeast-1.amazonaws.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/s3proxy/, '')
      }
    }
  }
})
