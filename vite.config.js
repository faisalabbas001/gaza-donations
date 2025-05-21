import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          // Split large dependencies into separate chunks
          web3: ['web3', 'ethers'],
          ui: ['framer-motion', 'react-hot-toast']
        }
      }
    }
  }
})