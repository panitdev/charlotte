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
    <Collapsible {...args} className="w-72 max-w-full">
      <CollapsibleTrigger fullWidth>Delivery details</CollapsibleTrigger>
      <CollapsibleContent>
        <p className="text-sm text-muted-foreground">
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
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" fullWidth className="h-[44px] transform-none! hover:bg-transparent">
              Delivery details
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-sm text-muted-foreground">Standard shipping takes 3–5 business days.</p>
          </CollapsibleContent>
        </Collapsible>
      </div>
    )
  },
}
