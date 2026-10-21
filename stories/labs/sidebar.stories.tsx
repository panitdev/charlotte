import type { Meta, StoryObj } from "@storybook/react"
import { Cpu, Folder, KeyRound, Layers, MoreHorizontal, Settings, User } from "lucide-react"
import * as React from "react"

import { Sidebar, type SidebarItem } from "@charlotte-ui/labs/sidebar"

const meta: Meta<typeof Sidebar> = {
  title: "Labs/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="h-[560px] w-60 border-r border-sidebar-border bg-sidebar">
        <Story />
      </div>
    ),
  ],
}

export default meta

const more = (label: string) => (
  <button type="button" aria-label={`More actions for ${label}`}>
    <MoreHorizontal className="size-4" />
  </button>
)

// ─── Default ──────────────────────────────────────────────────────────────

export const Default: StoryObj<typeof Sidebar> = {
  render: () => {
    const [active, setActive] = React.useState("models")
    const [open, setOpen] = React.useState(true)

    const row = (key: string, label: string, extra: Partial<SidebarItem> = {}): SidebarItem => ({
      id: key,
      label,
      active: active === key,
      onClick: () => setActive(key),
      ...extra,
    })

    return (
      <Sidebar
        ariaLabel="Primary navigation"
        newLabel="New project"
        onNewClick={() => {}}
        sections={[
          {
            items: [
              row("models", "Models", { icon: Cpu }),
              row("credentials", "Credentials", { icon: KeyRound }),
              row("environments", "Environments", { icon: Layers }),
            ],
          },
          {
            label: "Projects",
            items: [
              row("project:web", "Website", {
                icon: Folder,
                open,
                onOpenChange: setOpen,
                actions: more("Website"),
                children: [
                  row("thread:1", "Fix the login redirect", { actions: more("Fix the login redirect") }),
                  row("thread:2", "Landing page copy", { actions: more("Landing page copy") }),
                ],
              }),
            ],
          },
          {
            label: "Threads",
            items: [
              row("thread:3", "Untitled thread", { actions: more("Untitled thread") }),
              row("thread:4", "Untitled thread", { actions: more("Untitled thread") }),
              row("thread:5", "Draft release notes", { actions: more("Draft release notes") }),
            ],
          },
        ]}
      />
    )
  },
}

// ─── Submenu ──────────────────────────────────────────────────────────────

export const Submenu: StoryObj<typeof Sidebar> = {
  render: () => {
    const [active, setActive] = React.useState("profile")

    const row = (key: string, label: string, extra: Partial<SidebarItem> = {}): SidebarItem => ({
      id: key,
      label,
      active: active === key,
      onClick: () => setActive(key),
      ...extra,
    })

    return (
      <Sidebar
        sections={[
          {
            items: [
              {
                label: "Settings",
                icon: Settings,
                submenu: {
                  label: "Settings",
                  sections: [
                    {
                      items: [
                        row("profile", "Profile", { icon: User }),
                        row("credentials", "Credentials", { icon: KeyRound }),
                      ],
                    },
                  ],
                },
              },
              row("models", "Models", { icon: Cpu }),
            ],
          },
        ]}
      />
    )
  },
}
