// @ts-check
import { defineConfig } from 'astro/config';
import { esES } from '@clerk/localizations';

import tailwindcss from '@tailwindcss/vite';
import clerk from "@clerk/astro"
import node from '@astrojs/node';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  integrations: [clerk({localization: esES})],
  adapter: vercel(),
  output: "server",

  vite: {
    plugins: [tailwindcss()]
  }
});