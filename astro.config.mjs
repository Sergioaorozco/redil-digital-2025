// @ts-check
import { defineConfig } from 'astro/config';
import { esES } from '@clerk/localizations';

import clerk from "@clerk/astro"

import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [clerk({localization: esES})],
  output: "server",
  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()],
  },
});