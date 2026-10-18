import type { Meta, StoryObj } from "@storybook/react"
import {
  Activity,
  BarChart3,
  Command,
  Inbox,
  Search,
  Sparkles,
  Workflow,
} from "lucide-react"
import * as React from "react"

import { Button } from "@charlotte-ui/button"

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Button>

export const Variants: Story = {
  render: () => (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="flex items-center gap-3">
        <Button size="sm">Ship update</Button>
        <Button size="icon-sm" aria-label="Ship update">
          <Sparkles className="size-4" />
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Button size="sm" variant="outline">
          Review diff
        </Button>
        <Button size="icon-sm" variant="outline" aria-label="Open command menu">
          <Command className="size-4" />
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Button size="sm" variant="secondary">
          Queue sync
        </Button>
        <Button size="icon-sm" variant="secondary" aria-label="Queue sync">
          <Inbox className="size-4" />
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Button size="sm" variant="ghost">
          Search
        </Button>
        <Button size="icon-sm" variant="ghost" aria-label="Search">
          <Search className="size-4" />
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Button size="sm" variant="destructive">
          Delete item
        </Button>
        <Button size="icon-sm" variant="destructive" aria-label="Delete item">
          <Activity className="size-4" />
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Button size="sm" variant="link">
          View docs
        </Button>
        <Button size="icon-sm" variant="link" aria-label="View docs">
          <Workflow className="size-4" />
        </Button>
      </div>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm" loading>
        Syncing
      </Button>
    </div>
  ),
}

export const AnimateWidth: Story = {
  render: function AnimateWidthDemo() {
    const [loading, setLoading] = React.useState(false)
    return (
      <Button
        size="sm"
        loading={loading}
        animateWidth
        onClick={() => {
          setLoading(true)
          setTimeout(() => setLoading(false), 2000)
        }}
      >
        Synchronize
      </Button>
    )
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}
