import type { Meta, StoryObj } from "@storybook/react"
import { Mail } from "lucide-react"
import * as React from "react"

import { Input } from "@charlotte-ui/input"

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Input>

export const AllTypes: Story = {
  render: function AllTypesDemo() {
    const [values, setValues] = React.useState({
      email: "ops@example.com",
      amount: "24",
      date: "2026-05-25",
      time: "09:30",
      datetime: "2026-05-25T09:30",
      color: "#e11d48",
    })
    const set = (key: keyof typeof values) => (v: string) =>
      setValues((cur) => ({ ...cur, [key]: v }))

    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="notify-email"
          label="Deploy notification email"
          value={values.email}
          onChange={set("email")}
          placeholder="team@example.com"
          type="email"
          icon={<Mail className="h-4 w-4" />}
          validate={(v) => (/\S+@\S+\.\S+/.test(v) ? null : "Enter a valid email address.")}
        />
        <Input
          id="batch-size"
          label="Batch size"
          value={values.amount}
          onChange={set("amount")}
          type="number"
          placeholder="24"
          validate={(v) => {
            const n = Number(v)
            return Number.isFinite(n) && n >= 1 ? null : "Use a number greater than 0."
          }}
        />
        <Input
          id="launch-date"
          label="Launch date"
          value={values.date}
          onChange={set("date")}
          type="date"
          validate={(v) => (v ? null : "Choose a launch date.")}
        />
        <Input
          id="launch-time"
          label="Launch time"
          value={values.time}
          onChange={set("time")}
          type="time"
          validate={(v) => (v ? null : "Choose a launch time.")}
        />
        <Input
          id="launch-window"
          label="Launch window"
          value={values.datetime}
          onChange={set("datetime")}
          type="datetime-local"
          validate={(v) => (v ? null : "Choose a launch window.")}
        />
        <Input
          id="accent-color"
          label="Accent color"
          value={values.color}
          onChange={set("color")}
          type="color"
          validate={(v) => (/^#[0-9a-fA-F]{6}$/.test(v) ? null : "Use a full hex color.")}
        />
      </div>
    )
  },
  decorators: [() => <div />],
}

export const EmailField: Story = {
  render: function EmailDemo() {
    const [value, setValue] = React.useState("ops@example.com")
    return (
      <Input
        id="email-story"
        label="Deploy notification email"
        value={value}
        onChange={setValue}
        placeholder="team@example.com"
        type="email"
        icon={<Mail className="h-4 w-4" />}
        validate={(v) => (/\S+@\S+\.\S+/.test(v) ? null : "Enter a valid email address.")}
      />
    )
  },
}
