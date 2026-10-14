import { createFileRoute } from "@tanstack/react-router";
import registryConfig from "../../registry.config.json";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(
          `User-agent: *\nAllow: /\n\nSitemap: ${registryConfig.url}/sitemap.xml\n`,
          { headers: { "Content-Type": "text/plain" } },
        ),
    },
  },
});
