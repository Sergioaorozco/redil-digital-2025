// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel({
    imageService: true,
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      YT_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
        default: 'INFORM_VALID_KEY'
      }),
      YT_CHANNEL_ID: envField.string({
        context: 'server',
        access: 'public',
        optional: false,
        default: 'INFORM_VALID_KEY'
      }),
      FIREBASE_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
        default: 'INFORM_VALID_KEY'
      }),
      FIREBASE_AUTH_DOMAIN: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
        default: 'INFORM_VALID_KEY'
      }),
      FIREBASE_STOGARE_BUCKET: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
        default: 'INFORM_VALID_KEY'
      }),
      FIREBASE_MESSAGING_SENDER_ID: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
        default: 'INFORM_VALID_KEY'
      }),
      FIREBASE_APP_ID: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
        default: 'INFORM_VALID_KEY'
      }),
      FIREBASE_PROJECT_ID: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
        default: 'INFORM_VALID_KEY'
      })
    }
  },
  integrations: [react()],
});