import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Improve the handling of environment variables
    rollupOptions: {
      output: {
        // Ensure environment variables are handled properly
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        }
      }
    },
    // Minimize for production
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console logs in production
        drop_console: true,
      },
    },
  },
  // Configure environment variable handling
  define: {
    // Replace process.env with import.meta.env
    'process.env': {}
  }
})
