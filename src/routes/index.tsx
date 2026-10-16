import { createFileRoute } from "@tanstack/react-router";
import Link from "fumadocs-core/link";
import { ChevronsDownIcon } from "lucide-react";
import beagle from "@/assets/beagle.jpg";
import {
  BlockFrame,
  blockInstallItems,
  blockViewUrl,
} from "@/components/block-view";
import { GrainImage } from "@/components/grain-image";
import { InstallCommand } from "@/components/install-command";
import { Logo } from "@/components/logo";
import { GithubLink, ThemeToggle } from "@/components/site-actions";
import { pageHead } from "@/lib/head";
import { blocksUrl, componentsUrl } from "@/lib/nav";
import { appName } from "@/lib/shared";
import { buttonVariants } from "@/registry/n2020/ui/button";

export const Route = createFileRoute("/")({
  component: Home,
  head: () =>
    pageHead({
      title: `${appName} · A shadcn registry of Base UI components for dashboards`,
      path: "/",
    }),
});

const links = [
  { title: "Docs", href: "/docs" },
  { title: "Components", href: componentsUrl },
  { title: "Blocks", href: blocksUrl },
];

function Home() {
  return (
    <div className="flex min-h-svh flex-col">
      <div className="hero dark relative isolate bg-background text-foreground">
        <GrainImage
          src={beagle}
          className="absolute inset-y-0 right-0 -z-10 h-full w-full text-foreground/25 md:w-[min(72%,65.5rem)] md:text-foreground"
        />
        <header className="flex h-14 items-center gap-8 px-4 lg:px-10">
          <Link href="/" aria-label="n2020 home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 text-sm sm:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.title}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <GithubLink />
            <ThemeToggle />
          </div>
        </header>
        <section className="flex flex-col gap-8 px-4 pt-24 pb-24 lg:px-10 lg:pt-36">
          <h1 className="max-w-2xl font-display text-6xl leading-[0.95] tracking-tight text-balance sm:text-7xl lg:text-8xl">
            A component registry for dashboards
          </h1>
          <div className="flex max-w-md min-w-0 flex-col gap-5">
            <p className="text-muted-foreground">
              Components on Base UI and Tailwind CSS, with one look. You install
              them with the shadcn CLI, and the code is yours to change.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/docs" className={buttonVariants({ size: "lg" })}>
                Installation
              </Link>
              <Link
                href={componentsUrl}
                className={buttonVariants({ size: "lg", variant: "secondary" })}
              >
                Components
              </Link>
              <InstallCommand items={["theme"]} />
            </div>
          </div>
        </section>
        <a
          href="#examples"
          className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Examples
          <ChevronsDownIcon className="size-4" />
        </a>
      </div>

      <main
        id="examples"
        className="flex flex-1 flex-col px-4 pt-10 pb-10 lg:px-10"
      >
        <div className="flex flex-wrap items-end justify-between gap-4 pb-6">
          <h2 className="font-display text-5xl leading-none tracking-tight">
            Dashboard
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <InstallCommand items={blockInstallItems("dashboard")} />
            <Link
              href={blockViewUrl("dashboard")}
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Open full screen
            </Link>
          </div>
        </div>
        <BlockFrame name="dashboard" className="h-[min(820px,86svh)]" />
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t px-4 py-5 text-sm text-muted-foreground lg:px-10">
        <span>n2020</span>
        <nav className="flex gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.title}
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}
