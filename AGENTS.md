# charlotte

Charlotte UI: React components for Tailwind CSS v4, one npm package per
component under `@charlotte-ui`, built from `packages/*/src` with `tsc -b`.

- Primitives each get their own package (`packages/<name>`, entry
  `src/index.tsx`). Only components every UI library would have belong here.
- Anything else goes in `packages/labs` as its own file, exported as
  `@charlotte-ui/labs/<file>`.
- Packages import each other by package name (`@charlotte-ui/utils`), and the
  importing package lists it in `dependencies` and in its tsconfig
  `references`. Relative imports inside a package use a `.js` extension.
- Packages are versioned independently; bumping a version on main publishes it.
- A new package must also be added to `tsconfig.build.json` and to the publish
  order in `.github/workflows/publish.yml`.
- npm packages that hold React context or must be a singleton (`react`,
  `framer-motion`, `radix-ui`, `lucide-react`) are peer dependencies; the rest
  are regular dependencies.
- A package `description` says what the component is, in a sentence. Behaviour
  belongs in the component's doc comments and its stories.
