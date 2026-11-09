import type { APIRoute } from "astro";
import { withBase } from "../domain/urls";

export const GET: APIRoute = ({ site }) => new Response(
  "User-agent: *\nAllow: /\nSitemap: " + new URL(withBase(import.meta.env.BASE_URL, "sitemap-index.xml"), site).href + "\n",
  { headers: { "Content-Type": "text/plain; charset=utf-8" } },
);
