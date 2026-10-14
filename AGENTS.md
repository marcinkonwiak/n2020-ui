# n2020

A shadcn registry of restyled Base UI components, plus the docs site that serves it. `README.md` describes the layout, the commands, and the steps to add a component.

## Components from shadcn

The files in `registry/n2020/ui` started as shadcn components. The registry owns them now, and they are the source of truth.

- Edit a component file directly to change how it looks or behaves.
- Keep the shadcn props and exports, so that code written for shadcn works with these components.
- Do not run `pnpm shadcn add` for a component that the registry already has. The CLI replaces the file and removes the n2020 changes.
- To take an upstream fix, read the change in shadcn and edit the file.

## Custom components

- Put a component that shadcn does not have in `registry/n2020/components`.
- Import other registry files through `@/registry/n2020/...`. Do not import from `src`, because `src` is the docs site and the registry does not publish it.
- Add an example to `registry/n2020/examples` and a page to `content/docs/components` for each component.

## Blocks

- A block is a whole page in one file in `registry/n2020/blocks`. The file has a default export.
- The build adds each block to `registry.json`, and the site shows it at `/view/<name>` and on `/blocks`.
- Build a block only from registry components, and keep its sample data in the file.

## The `"use client"` directive

People install these components into Next.js and other frameworks that use React Server Components, so the directive must stay.

- `components.json` sets `rsc` to `true`. With that setting, `pnpm shadcn add` keeps the directive that the stock file has. Do not set `rsc` to `false`.
- Start a custom component with `"use client";` if it uses a hook, an event handler, or a browser API.
- `pnpm registry:build` fails if a file in `ui`, `components`, `blocks`, or `examples` calls a hook or passes an `on*` prop without the directive. The check does not find browser APIs.

## Theme

- Colours, fonts, and the radius are tokens in `registry/n2020/theme.css`.
- The design has no rounded corners. `--radius` is `0`, so do not add `rounded-*` classes.

## Generated files

Do not edit `registry.json` or `public/r`. `pnpm registry:build` writes both from the files in `registry/n2020`.

## Checks

Run these commands before you finish a change:

1. `pnpm lint`
2. `pnpm types:check`
3. `scripts/test-install.sh`. The script installs every item into a new shadcn app and builds that app.
