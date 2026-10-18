import type { Meta, StoryObj } from "@storybook/react"
import {
  Bell,
  CreditCard,
  Fingerprint,
  KeyRound,
  LogOut,
  Palette,
  Shield,
  SquareAsterisk,
  Trash2,
  User,
} from "lucide-react"
import * as React from "react"

import { ActionRow, ActionRowGroup } from "@charlotte-ui/labs/action-row"

const meta: Meta<typeof ActionRow> = {
  title: "Labs/Action Row",
  component: ActionRow,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-[420px] p-6">
        <Story />
      </div>
    ),
  ],
}

export default meta

// ─── Default ──────────────────────────────────────────────────────────────

export const Default: StoryObj<typeof ActionRow> = {
  render: () => (
    <ActionRowGroup>
      <ActionRow
        icon={<User />}
        label="Account"
        description="Name, username, and email"
        chevron
      />
      <ActionRow
        icon={<Shield />}
        label="Security"
        description="Password, two-factor, and passphrase"
        chevron
      />
      <ActionRow
        icon={<Bell />}
        label="Notifications"
        description="What we email you about"
        chevron
      />
    </ActionRowGroup>
  ),
}

// ─── Without descriptions ─────────────────────────────────────────────────

export const LabelOnly: StoryObj<typeof ActionRow> = {
  render: () => (
    <ActionRowGroup>
      <ActionRow icon={<Palette />} label="Appearance" chevron />
      <ActionRow icon={<CreditCard />} label="Billing" chevron />
      <ActionRow label="Advanced" chevron />
    </ActionRowGroup>
  ),
}

// ─── Destructive ──────────────────────────────────────────────────────────

export const Destructive: StoryObj<typeof ActionRow> = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ActionRowGroup>
        <ActionRow
          icon={<LogOut />}
          label="Sign out"
          description="End this session on this device"
          destructive
        />
      </ActionRowGroup>
      <ActionRowGroup>
        <ActionRow
          icon={<Trash2 />}
          label="Delete account"
          description="This cannot be undone"
          destructive
        />
      </ActionRowGroup>
    </div>
  ),
}

// ─── Accent tints ─────────────────────────────────────────────────────────
//
// `iconClassName` retints the icon square per row without touching the rest of
// the layout — useful when the rows are choices rather than a settings list.

export const AccentIcons: StoryObj<typeof ActionRow> = {
  render: () => (
    <ActionRowGroup>
      <ActionRow
        icon={<KeyRound />}
        iconClassName="bg-primary/10 text-primary"
        label="Use a password"
        description="Sign in the usual way"
        chevron
      />
      <ActionRow
        icon={<SquareAsterisk />}
        iconClassName="bg-primary/10 text-primary"
        label="Use passphrase"
        description="Sign in with your 6-word passphrase"
        chevron
      />
      <ActionRow
        icon={<Fingerprint />}
        iconClassName="bg-primary/10 text-primary"
        label="Use a passkey"
        description="Face, fingerprint, or security key"
        chevron
      />
    </ActionRowGroup>
  ),
}

// ─── Disabled ─────────────────────────────────────────────────────────────

export const Disabled: StoryObj<typeof ActionRow> = {
  render: () => (
    <ActionRowGroup>
      <ActionRow icon={<Shield />} label="Security" chevron />
      <ActionRow
        icon={<Fingerprint />}
        label="Passkeys"
        description="Not available on this browser"
        chevron
        disabled
      />
    </ActionRowGroup>
  ),
}

// ─── Interactive ──────────────────────────────────────────────────────────

export const Interactive: StoryObj<typeof ActionRow> = {
  render: () => {
    const [selected, setSelected] = React.useState<string | null>(null)

    return (
      <div className="flex flex-col gap-4">
        <ActionRowGroup>
          <ActionRow
            icon={<User />}
            label="Account"
            chevron
            onSelect={() => setSelected("Account")}
          />
          <ActionRow
            icon={<Shield />}
            label="Security"
            chevron
            onSelect={() => setSelected("Security")}
          />
          <ActionRow
            icon={<LogOut />}
            label="Sign out"
            destructive
            onSelect={() => setSelected("Sign out")}
          />
        </ActionRowGroup>
        <p className="text-center text-sm text-muted-foreground">
          {selected ? `Selected: ${selected}` : "Nothing selected yet"}
        </p>
      </div>
    )
  },
}
