// @ts-check
import { defineConfig } from 'astro/config';
import { esUY } from '@clerk/localizations';

import tailwindcss from '@tailwindcss/vite';
import clerk from "@clerk/astro"
import node from '@astrojs/node';
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  integrations: [clerk({localization: esUY}), vue()],
  adapter: node({ mode: "standalone" }),
  output: "server",

  vite: {
    plugins: [tailwindcss()]
  }
});