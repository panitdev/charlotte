import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Globe, Languages, MapPin } from "lucide-react"

import { Input } from "@charlotte-ui/input"
import { Label } from "@charlotte-ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@charlotte-ui/select"

const meta: Meta<typeof SelectTrigger> = {
  title: "Components/Select",
  component: SelectTrigger,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["default", "sm"] },
    disabled: { control: "boolean" },
  },
}

export default meta
type Story = StoryObj<typeof SelectTrigger>

const fruits = ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]

export const Default: Story = {
  render: (args) => (
    <Select>
      <SelectTrigger {...args} className="w-64">
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectContent>
        {fruits.map((fruit) => (
          <SelectItem key={fruit} value={fruit.toLowerCase()}>
            {fruit}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
}

/** `default` matches the animated field's 44px row; `sm` fits dense rows. */
export const Sizes: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-4">
      {(["default", "sm"] as const).map((size) => (
        <Select key={size} defaultValue="apple">
          <SelectTrigger size={size}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fruits.map((fruit) => (
              <SelectItem key={fruit} value={fruit.toLowerCase()}>
                {fruit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  ),
}

/** The trigger borrows the field's shell, so the two line up in one form. */
export const AlongsideInput: Story = {
  render: () => {
    const [email, setEmail] = React.useState("")
    return (
      <div className="flex w-80 flex-col gap-4">
        <Input
          id="contact-email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          icon={<Globe className="size-4" />}
          validate={(v) => (v && !v.includes("@") ? "That isn't an email." : null)}
        />
        <div>
          <Label htmlFor="contact-region" className="mb-1.5 block text-sm font-medium text-foreground/80">
            Region
          </Label>
          <Select>
            <SelectTrigger id="contact-region">
              <SelectValue placeholder="Choose a region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eu">
                <MapPin /> Europe
              </SelectItem>
              <SelectItem value="na">
                <MapPin /> North America
              </SelectItem>
              <SelectItem value="apac">
                <MapPin /> Asia Pacific
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  },
}

export const Grouped: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-64">
        <Languages />
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Latin</SelectLabel>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="fr">French</SelectItem>
          <SelectItem value="pt">Portuguese</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>CJK</SelectLabel>
          <SelectItem value="ko">한국어</SelectItem>
          <SelectItem value="ja">日本語</SelectItem>
          <SelectItem value="zh">中文</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("banana")
    return (
      <div className="flex w-64 flex-col gap-3">
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fruits.map((fruit) => (
              <SelectItem key={fruit} value={fruit.toLowerCase()}>
                {fruit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">selected: {value}</p>
      </div>
    )
  },
}

/** Disabled trigger, and a disabled option inside an otherwise open menu. */
export const Disabled: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-4">
      <Select disabled defaultValue="apple">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Pick a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana" disabled>
            Banana (out of stock)
          </SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

/** `aria-invalid` swaps the halo to the field's destructive tone. */
export const Invalid: Story = {
  render: () => (
    <div className="w-64">
      <Select>
        <SelectTrigger aria-invalid aria-describedby="region-error">
          <SelectValue placeholder="Choose a region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="eu">Europe</SelectItem>
          <SelectItem value="na">North America</SelectItem>
        </SelectContent>
      </Select>
      <p id="region-error" className="mt-1 text-xs text-destructive">
        Pick a region to continue.
      </p>
    </div>
  ),
}

/** Long enough to page the scroll buttons at either end of the viewport. */
export const LongList: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Pick a timezone offset" />
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: 27 }, (_, i) => i - 12).map((offset) => (
          <SelectItem key={offset} value={String(offset)}>
            UTC{offset >= 0 ? `+${offset}` : offset}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
}

export const InForm: Story = {
  render: () => (
    <form
      className="flex w-64 flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        // eslint-disable-next-line no-console
        console.log("plan:", data.get("plan"))
      }}
    >
      <Label htmlFor="plan">Plan</Label>
      <Select name="plan" defaultValue="pro" required>
        <SelectTrigger id="plan">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
          <SelectItem value="team">Team</SelectItem>
        </SelectContent>
      </Select>
      <button type="submit" className="rounded-md border px-2 py-1 text-xs">
        Submit
      </button>
    </form>
  ),
}
