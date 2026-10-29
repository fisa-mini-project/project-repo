import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import manifest from './src/manifest.js'
import path from 'path'

export default defineConfig(() => {
  return {
    optimizeDeps: {
      include: ['@mozilla/readability']
    },
    build: {
     emptyOutDir: true,
      outDir: 'build',
      rollupOptions: {

        input: {
          // ✅ 반드시 content script 파일을 명시
          contentScript: path.resolve(__dirname, 'src/contentScript/index.js'),
          background: path.resolve(__dirname, 'src/background/index.js'),
        },
        output: {
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/chunk-[hash].js',
          format: 'es',
        },
      },
    },
    plugins: [crx({ manifest }), react()],
    legacy: {
      skipWebSocketTokenCheck: true,
    },
  }
})
