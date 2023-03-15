import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import reactRefresh from '@vitejs/plugin-react-refresh';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), reactRefresh()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 8854
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: "@import 'src/assets/css/index.module.scss';"
      }
    }
  }
});
