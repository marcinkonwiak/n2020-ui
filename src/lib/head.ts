import registryConfig from "../../registry.config.json";
import { appDescription } from "./shared";

export const shareImage = {
  url: `${registryConfig.url}/og.png`,
  width: 1200,
  height: 630,
};

export function pageHead({
  title,
  description = appDescription,
  path,
}: {
  title: string;
  description?: string;
  path: string;
}) {
  const url = new URL(path, registryConfig.url).href;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
