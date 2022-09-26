import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";
import image from "@astrojs/image";

import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), image()],
  output: "server",
  adapter: netlify()
});