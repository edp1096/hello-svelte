import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { name as pkgname } from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: "",
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/${pkgname}-[hash].js`,
        assetFileNames: `assets/${pkgname}-[hash].[ext]`,
      },
    },
  },
})
