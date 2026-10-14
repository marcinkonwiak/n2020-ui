import { createFileRoute, notFound } from "@tanstack/react-router";
import { Suspense } from "react";
import { Block, blockNames } from "@/components/block-view";

export const Route = createFileRoute("/view/$name")({
  component: View,
  // The bare page that the block frames load.
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  loader: ({ params }) => {
    if (!blockNames.includes(params.name)) throw notFound();
  },
});

function View() {
  const { name } = Route.useParams();
  return (
    <Suspense>
      <Block name={name} />
    </Suspense>
  );
}
