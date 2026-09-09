import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.js'],
    include: ['src/**/*.test.jsx', 'src/**/*.test.js'],
    globals: false,
    css: false
  }
});
