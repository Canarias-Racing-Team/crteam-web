// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import icon from "astro-icon";
import pageInsight from "astro-page-insight";
// import sanity from "@sanity/astro";

// https://astro.build/config
export default defineConfig({
  site: "https://crteam.es",
  integrations: [icon(), sitemap(), pageInsight(), /* sanity() */],

  vite: {
    plugins: [tailwindcss()],
  },

  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
});