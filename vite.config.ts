import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
  },
  resolve: {
    alias: {
      canvg: path.resolve(__dirname, 'src/stubs/canvg-stub.js'),
      dompurify: path.resolve(__dirname, 'src/stubs/dompurify-stub.js'),
    },
  },
})
