// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://liebenzeller-fischer.de',
  // Bilder, Plugins und Schriften liegen weiter in static/ (wie bei Hugo)
  publicDir: './static',
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // Theme nutzt noch @import
          silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
        },
      },
    },
  },
});
