# Charlotte UI

React components for Tailwind CSS v4, published one package per component
under the `@charlotte-ui` scope.

| Package | |
| --- | --- |
| `@charlotte-ui/button` | Button |
| `@charlotte-ui/input` | Labelled text input with inline validation |
| `@charlotte-ui/label` | Form label |
| `@charlotte-ui/textarea` | Multi-line text input |
| `@charlotte-ui/select` | Select menu |
| `@charlotte-ui/switch` | Toggle switch |
| `@charlotte-ui/card` | Card surface |
| `@charlotte-ui/table` | Data table parts |
| `@charlotte-ui/dropdown-menu` | Dropdown menu |
| `@charlotte-ui/dialog` | Dialog, a bottom drawer on small screens |
| `@charlotte-ui/labs` | Experimental components; may change or go away |
| `@charlotte-ui/theme` | Design tokens and base styles |
| `@charlotte-ui/utils` | `cn` and shared motion constants |

## Usage

Install the theme once, then the components you need along with their peers:

```bash
bun add @charlotte-ui/theme @charlotte-ui/button framer-motion radix-ui lucide-react
```

Import the theme after Tailwind. It also registers every installed
`@charlotte-ui` package with Tailwind's class scanner, which otherwise skips
`node_modules`:

```css
@import "tailwindcss";
@import "@charlotte-ui/theme";
```

With pnpm's isolated layout the packages aren't siblings on disk, so add the
source yourself:

```css
@source "../node_modules/@charlotte-ui";
```

```tsx
import { Button } from "@charlotte-ui/button"
import { FlowDialog } from "@charlotte-ui/labs/flow-dialog"
```

## Development

```bash
bun install
bun run dev        # Storybook on :6006, reads package sources directly
bun run build      # tsc -b into each package's dist/
bun run typecheck
```

## Release

Each package is versioned on its own. Bump the version in that package's
`package.json` and merge to main: `.github/workflows/publish.yml` publishes
every package whose version isn't on npm yet and tags it `<name>@<version>`.

When a release needs a newer version of another `@charlotte-ui` package, raise
its range in the dependent's `package.json` in the same change.

Every commit and pull request is also published to [pkg.pr.new](https://pkg.pr.new)
by `.github/workflows/preview.yml`, without touching npm. Install one by commit:

```sh
npm i https://pkg.pr.new/@charlotte-ui/button@<sha>
```
