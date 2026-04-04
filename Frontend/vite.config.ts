import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname,'./src/utils'),
      "@templates": path.resolve(__dirname, "./src/templates")
    },
  },
  plugins: [react()],
  build: {
    commonjsOptions: { transformMixedEsModules: true } // Change
  }
})
