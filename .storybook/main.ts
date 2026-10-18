import type { StorybookConfig } from "@storybook/react-vite"
import tsconfigPaths from "vite-tsconfig-paths"

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    config.plugins = config.plugins ?? []
    config.plugins.push(tsconfigPaths())
    config.build = {
      ...config.build,
      copyPublicDir: false,
    }
    return config
  },
}

export default config
