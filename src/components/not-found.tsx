import Link from "fumadocs-core/link";
import { Sky } from "@/registry/n2020/components/sky";
import { buttonVariants } from "@/registry/n2020/ui/button";

export function NotFound() {
  return (
    <main className="relative isolate flex min-h-svh flex-col items-start justify-end gap-4 p-6 lg:p-12">
      <Sky className="absolute inset-0 -z-10 size-full" />
      <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
        Error 404
      </p>
      <h1 className="font-display text-7xl leading-none lg:text-9xl">
        Not found
      </h1>
      <Link href="/" className={buttonVariants()}>
        Go home
      </Link>
    </main>
  );
}
