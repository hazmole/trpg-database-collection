// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  base: '/trpg-database-collection',
  integrations: [react()]
});