import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false // Allows you to test the PWA in localhost
      },
      workbox: {
        navigateFallbackDenylist: [/^\/godot\//],
        globPatterns: ['**/*.{js,css,html,ico,png,svg,wasm,pck}'],
        maximumFileSizeToCacheInBytes: 64 * 1024 * 1024
      },
      manifest: {
        name: 'HelpMe - Medical Guide',
        short_name: 'HelpMe',
        description: 'Offline first-aid and medical triage',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})