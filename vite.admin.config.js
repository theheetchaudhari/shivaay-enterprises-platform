import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// Dev-only plugin: rewrites '/' → '/admin.html' so the dev server
// serves the admin entry point instead of the default index.html.
const adminDevEntry = {
  name: 'admin-dev-entry',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url === '/' || req.url === '') {
        req.url = '/admin.html'
      }
      next()
    })
  },
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    adminDevEntry,
  ],
  server: {
    port: 5174,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: 'admin.html',
    },
  },
})
