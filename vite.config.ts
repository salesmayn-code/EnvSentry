import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves the site from /EnvSentry/. The dev server stays at /.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/EnvSentry/' : '/',
  plugins: [react(), tailwindcss()],
}))
