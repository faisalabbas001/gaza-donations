import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: 'dist', // 👈 output directory (default, but now explicit)
    chunkSizeWarningLimit: 2000, // 👈 increase limit to suppress warnings
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 👇 Code-splitting large node_modules
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString()
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 👈 helpful for clean imports
    },
  },
})
