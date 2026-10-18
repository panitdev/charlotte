import type { Meta, StoryObj } from "@storybook/react"

import { AmbientBackground } from "@charlotte-ui/labs/ambient-background"
import type { AmbientBackgroundProps } from "@charlotte-ui/labs/ambient-background"

type StoryArgs = AmbientBackgroundProps & { showOverlay?: boolean }

const meta: Meta<StoryArgs> = {
  title: "Labs/Ambient Background",
  component: AmbientBackground,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  argTypes: {
    debug: {
      control: "boolean",
      description: "Show blob boundary outlines and labels for debugging",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to size or reposition the container",
    },
    showOverlay: {
      control: "boolean",
      description: "Show/hide the example content overlay card",
    },
  },
}

export default meta
type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    debug: false,
    showOverlay: true,
  },
  render: ({ showOverlay = true, ...args }) => (
    <div className="relative min-h-screen">
      <AmbientBackground {...args} />
      {showOverlay && (
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="rounded-xl border bg-background/60 p-8 text-center shadow-lg backdrop-blur-md">
            <p className="text-lg font-medium text-foreground">Content overlay</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The ambient background sits behind this card.
            </p>
          </div>
        </div>
      )}
    </div>
  ),
}

export const Contained: Story = {
  args: {
    debug: false,
    showOverlay: true,
  },
  render: ({ showOverlay = true, ...args }) => (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl">
        <AmbientBackground {...args} className="h-80" />
        {showOverlay && (
          <div className="relative z-10 flex h-80 items-center justify-center">
            <div className="rounded-xl border bg-background/60 p-8 text-center shadow-lg backdrop-blur-md">
              <p className="text-lg font-medium text-foreground">
                Constrained container
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                The background is sized via <code>className=&quot;h-80&quot;</code> on AmbientBackground.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  ),
}
