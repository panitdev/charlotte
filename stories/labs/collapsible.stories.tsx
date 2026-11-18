import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"

import { Button } from "@charlotte-ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@charlotte-ui/labs/collapsible"

const meta: Meta<typeof Collapsible> = {
  title: "Labs/Collapsible",
  component: Collapsible,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Collapsible>

export const Default: Story = {
  render: (args) => (
    <Collapsible {...args} className="w-72 max-w-full space-y-2">
      <CollapsibleTrigger fullWidth>Delivery details</CollapsibleTrigger>
      <CollapsibleContent>
        <p className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
          Orders ship within two business days. Tracking is emailed once your order ships.
        </p>
      </CollapsibleContent>
    </Collapsible>
  ),
}

export const Disabled: Story = {
  ...Default,
  args: { disabled: true },
}

export const Controlled: Story = {
  render: function Controlled() {
    const [open, setOpen] = React.useState(false)

    return (
      <div className="w-72 max-w-full space-y-4">
        <Button type="button" variant="outline" onClick={() => setOpen(!open)}>
          {open ? "Hide delivery details" : "Show delivery details"}
        </Button>
        <Collapsible open={open} onOpenChange={setOpen} className="space-y-2">
          <CollapsibleTrigger asChild>
            <Button variant="secondary">Delivery details</Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="px-4 py-2 text-sm text-muted-foreground">Standard shipping takes 3–5 business days.</p>
          </CollapsibleContent>
        </Collapsible>
      </div>
    )
  },
}
