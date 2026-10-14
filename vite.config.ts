import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { fumadocsMdx } from "fumadocs-mdx/vite";
import { defineConfig } from "vite";
import registryConfig from "./registry.config.json";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    fumadocsMdx(),
    tailwindcss(),
    tanstackStart({
      pages: [{ path: "/robots.txt", sitemap: { exclude: true } }],
      prerender: {
        enabled: true,
        onSuccess: ({ html }) =>
          html.includes('<meta name="robots" content="noindex"')
            ? { sitemap: { exclude: true } }
            : undefined,
      },
      sitemap: { host: registryConfig.url },
    }),
    react(),
  ],
  // fumadocs-mdx injects this import when it compiles a page, so the
  // dependency scanner misses it and reloads the server on the first request.
  environments: {
    ssr: {
      optimizeDeps: {
        include: ["fumadocs-mdx/runtime/macro"],
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
});
