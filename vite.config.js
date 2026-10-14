import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { promptCopiesPlugin } from './server/vite-stats.mjs';
export default defineConfig({
  plugins: [react(), promptCopiesPlugin()],
  server: { strictPort: true },
  optimizeDeps: {
    include: ['react', 'react-dom/client', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'lucide-react', 'yaml'],
  },
});
