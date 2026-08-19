import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Offline total : le build produit un unique index.html autonome (JS, CSS et
// polices inlinés) qui s'ouvre en double-clic, sans serveur ni réseau.
// Les modules ES externes sont bloqués en file:// par Chrome, d'où le single file.
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: {
    assetsInlineLimit: 100_000_000,
    chunkSizeWarningLimit: 8000,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
