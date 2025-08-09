// @ts-check
import { defineConfig } from 'astro/config';
import { esES } from '@clerk/localizations';

import tailwindcss from '@tailwindcss/vite';
import clerk from "@clerk/astro"
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  integrations: [clerk({localization: esES})],
  adapter: node({ mode: "standalone" }),
  output: "server",

  vite: {
    plugins: [tailwindcss()]
  }
});