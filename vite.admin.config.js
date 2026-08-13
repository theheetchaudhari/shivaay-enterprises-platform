import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

// Inline plugin: renames dist-admin/admin.html → dist-admin/index.html
// so Vercel finds the correct entry point without needing vercel.json.
const renameAdminHtml = {
  name: 'rename-admin-html',
  closeBundle() {
    const from = path.resolve('dist-admin', 'admin.html')
    const to   = path.resolve('dist-admin', 'index.html')
    if (fs.existsSync(from)) {
      fs.renameSync(from, to)
      console.log('✓ Renamed dist-admin/admin.html → dist-admin/index.html')
    }
  },
}

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
    renameAdminHtml,
    adminDevEntry,
  ],
  server: {
    port: 5174,
  },
  build: {
    outDir: 'dist-admin',
    rollupOptions: {
      input: 'admin.html',
    },
  },
})
