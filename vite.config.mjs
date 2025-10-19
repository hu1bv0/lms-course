import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@modules': path.resolve(__dirname, './src/modules'),
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  server: {
    port: 3000,
    open: false, // Disable auto-open browser to prevent xdg-open error
    host: true, // Allow external connections
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});