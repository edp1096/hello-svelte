import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import liveReload from 'vite-plugin-live-reload'
import { name as pkgname } from './package.json'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), liveReload(['./src/**/*.svelte'], { alwaysReload: true })],
  base: "",
  build: {
    rollupOptions: {
      output: {
        // entryFileNames: `assets/${pkgname}-[hash].js`,
        // chunkFileNames: `assets/${pkgname}-[hash].js`,
        // assetFileNames: `assets/${pkgname}-[hash].[ext]`,
        entryFileNames: `assets/${pkgname}.js`,
        chunkFileNames: `assets/${pkgname}.js`,
        assetFileNames: `assets/${pkgname}.[ext]`,
      },
    },
  },
})
