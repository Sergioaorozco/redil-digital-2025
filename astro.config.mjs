// @ts-check
import { defineConfig } from 'astro/config';
import clerk from "@clerk/astro"
import node from '@astrojs/node';
import { esES } from '@clerk/localizations';

import tailwindcss from '@tailwindcss/vite';

import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [clerk({
    localization: esES,
  }), vue()],

  adapter: node({
    mode: 'standalone'
  }),

  vite: {
    plugins: [tailwindcss()]
  }
});