import { defineConfig, splitVendorChunkPlugin } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import liveReload from 'vite-plugin-live-reload'
import { name as pkgname } from './package.json'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), liveReload(['./src/**/*.svelte'], { alwaysReload: true }), splitVendorChunkPlugin()],
  base: "",
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/${pkgname}-[hash].js`,
        assetFileNames: `assets/${pkgname}-[hash].[ext]`,
        chunkFileNames: `assets/[name]-[hash].js`,
      },
    },
  },
})
