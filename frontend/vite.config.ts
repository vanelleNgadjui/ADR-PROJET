import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Permettre l'accès aux fichiers du template
      allow: ['..']
    }
  },
  publicDir: 'public',
})
