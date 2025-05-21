import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) {
              return 'framer-motion'
            }
            if (id.includes('react')) {
              return 'react-vendor'
            }
            if (id.includes('web3') || id.includes('ethers')) {
              return 'web3-vendor'
            }
            return 'vendor'
          }
        }
      }
    }
  },
  esbuild: {
    supported: {
      'top-level-await': true
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})