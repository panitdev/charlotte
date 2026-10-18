import type { Preview } from "@storybook/react"
import "../styles/globals.css"

const preview: Preview = {
  parameters: {
    options: {
      storySort: { order: ["Components", "Labs"] },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
