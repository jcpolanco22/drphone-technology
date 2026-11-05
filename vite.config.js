import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Permite que los archivos se carguen correctamente en subcarpetas
  server: {
    port: 5173,
    open: true
  }
})


