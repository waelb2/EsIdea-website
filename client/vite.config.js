import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    host: true,
    strictPort : true,
    port:5174,
    // host: "192.168.43.66"
  }
})
