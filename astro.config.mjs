// @ts-check
import { defineConfig } from 'astro/config';
import clerk from "@clerk/astro"
import node from '@astrojs/node';
import { esES } from '@clerk/localizations';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [clerk({
    localization: esES,
  })],

  adapter: node({
    mode: 'standalone'
  }),

  vite: {
    plugins: [tailwindcss()]
  }
});