import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves the site from /EnvSentry/. The dev server stays at /.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/EnvSentry/' : '/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        tokens: fileURLToPath(new URL('./tokens.html', import.meta.url)),
      },
    },
  },
}))
