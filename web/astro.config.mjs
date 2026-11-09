import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: process.env.SITE_URL || "https://mechanics-lib.bongames.org",
  base: process.env.BASE_PATH || "/",
  output: "static",
  trailingSlash: "always",
  integrations: [react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
