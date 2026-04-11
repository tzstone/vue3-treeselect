import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  root: 'demo',
  build: {
    outDir: '../dist-demo'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'vue3-treeselect': resolve(__dirname, 'src/index.ts')
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
