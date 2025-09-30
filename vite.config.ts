import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Base configuration settings for the build
  build: {
    // Output directory for the production build
    outDir: 'public', 
    
    // Configure Rollup input settings (ensuring index.html is the entry point)
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  },
  
  // Ensure the server can correctly find assets during development
  server: {
    port: 3000,
  }
});
