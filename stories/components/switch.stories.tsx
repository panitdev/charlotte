import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Bell, BellOff, Check, Moon, Sun, X } from "lucide-react"

import { Label } from "@charlotte-ui/label"
import { Switch } from "@charlotte-ui/switch"

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["default", "sm"] },
    disabled: { control: "boolean" },
    checked: { control: "boolean" },
  },
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  args: { defaultChecked: true },
}

/** `default` is 46×20, `sm` is 36×16. Size comes only from this prop. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Switch size="sm" defaultChecked />
      <Switch size="default" defaultChecked />
      <Switch size="sm" />
      <Switch size="default" />
    </div>
  ),
}

/**
 * Press and hold: the thumb blooms into a clear glass lens.
 * Drag or fling it — the lens stretches with speed and rubber-bands past the ends,
 * then springs to the nearest side when released. A tap keeps the lens up while it slides.
 * The colourful backdrop shows the glass picking up what's behind it.
 */
export const LiquidGlass: Story = {
  render: () => (
    <div className="grid place-items-center rounded-3xl bg-[radial-gradient(60%_80%_at_20%_30%,#ff9f0a,transparent_60%),radial-gradient(50%_70%_at_80%_70%,#5e5ce6,transparent_60%),radial-gradient(60%_60%_at_60%_20%,#ff375f,transparent_55%),linear-gradient(135deg,#64d2ff,#30d158)] px-24 py-16">
      <div className="scale-[2.5]">
        <Switch defaultChecked />
      </div>
    </div>
  ),
}

export const Uncontrolled: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Switch defaultChecked={false} />
      <Switch defaultChecked />
    </div>
  ),
}

/** Changing `checked` from outside (the button) blooms the lens while it slides, like a tap. */
export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false)
    return (
      <div className="flex flex-col items-center gap-4">
        <Switch checked={checked} onCheckedChange={setChecked} />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{checked ? "on" : "off"}</span>
          <button
            type="button"
            className="rounded-md border px-2 py-1 text-xs"
            onClick={() => setChecked((v) => !v)}
          >
            Toggle from outside
          </button>
        </div>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Switch disabled />
      <Switch disabled defaultChecked />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Switch id="marketing-emails" defaultChecked />
      <Label htmlFor="marketing-emails">Marketing emails</Label>
    </div>
  ),
}

/**
 * The two icons spin and scale past each other as the state flips,
 * and fade out while the glass lens is up.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Switch size="sm" checkedIcon={<Check />} uncheckedIcon={<X />} defaultChecked />
      <Switch checkedIcon={<Check />} uncheckedIcon={<X />} defaultChecked />
      <Switch checkedIcon={<Moon />} uncheckedIcon={<Sun />} />
      <Switch checkedIcon={<Bell />} uncheckedIcon={<BellOff />} defaultChecked />
    </div>
  ),
}

const SETTINGS = [
  "Wi-Fi",
  "Bluetooth",
  "Airplane mode",
  "Personal hotspot",
  "Notifications",
  "Sounds",
  "Focus",
  "Screen time",
  "Location services",
  "Background refresh",
]

/**
 * A long settings list. Idle switches are one small SVG each and do no layout
 * reads; the glass layer only exists on the switch being pressed.
 * Rows sit on half-pixel offsets (hairline separators), which is where an
 * off-centre thumb would show up — the gap stays even on every row at any zoom.
 */
export const ToggleList: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="mx-auto w-80 overflow-hidden rounded-xl border bg-card">
      {Array.from({ length: 40 }, (_, i) => (
        <label
          key={i}
          className="flex items-center justify-between px-4 py-2.5 text-sm [&+&]:border-t-[0.5px]"
        >
          {SETTINGS[i % SETTINGS.length]}
          {i >= SETTINGS.length ? ` ${Math.floor(i / SETTINGS.length) + 1}` : ""}
          <Switch defaultChecked={i % 3 !== 1} />
        </label>
      ))}
    </div>
  ),
}

/** In a right-to-left layout the track, thumb and drag direction all mirror. */
export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl" className="flex items-center gap-6">
      <Switch defaultChecked />
      <Switch />
      <Switch checkedIcon={<Check />} uncheckedIcon={<X />} defaultChecked />
    </div>
  ),
}

export const InForm: Story = {
  render: () => (
    <form
      className="flex items-center gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        // eslint-disable-next-line no-console
        console.log("notifications:", data.get("notifications"))
      }}
    >
      <Switch id="notifications" name="notifications" value="on" defaultChecked />
      <Label htmlFor="notifications">Notifications</Label>
      <button type="submit" className="rounded-md border px-2 py-1 text-xs">
        Submit
      </button>
    </form>
  ),
}
