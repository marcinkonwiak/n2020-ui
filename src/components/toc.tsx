import { type TableOfContents, TOCItem } from "fumadocs-core/toc";

export function Toc({ toc }: { toc: TableOfContents }) {
  if (toc.length === 0) return null;
  return (
    <aside className="sticky top-[calc(var(--header-height)+2rem)] hidden h-fit w-52 shrink-0 xl:block">
      <p className="mb-3 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
        On this page
      </p>
      <nav className="flex flex-col border-l">
        {toc.map((item) => (
          <TOCItem
            key={item.url}
            href={item.url}
            className="-ml-px border-l border-transparent py-1 text-sm text-muted-foreground transition-colors hover:text-foreground data-[active=true]:border-primary data-[active=true]:text-foreground"
            style={{ paddingLeft: `${(item.depth - 1) * 0.75}rem` }}
          >
            {item.title}
          </TOCItem>
        ))}
      </nav>
    </aside>
  );
}
