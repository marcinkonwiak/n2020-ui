import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { gitConfig } from "@/lib/shared";
import { cn } from "@/registry/n2020/lib/utils";
import { Button, buttonVariants } from "@/registry/n2020/ui/button";

export const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

export function GithubLink() {
  return (
    <a
      href={githubUrl}
      target="_blank"
      rel="noreferrer"
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "font-normal text-muted-foreground",
      )}
    >
      GitHub
    </a>
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Toggle color theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {/* The page theme decides the icon, also inside a section that is always dark. */}
      <SunIcon className="hidden [html.dark_&]:block" />
      <MoonIcon className="block [html.dark_&]:hidden" />
    </Button>
  );
}
