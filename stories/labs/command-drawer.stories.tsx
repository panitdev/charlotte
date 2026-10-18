import type { Meta, StoryObj } from "@storybook/react"
import {
  Calendar,
  Calculator,
  CreditCard,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Settings,
  Shield,
  Smile,
  Trash2,
  User,
  Users,
} from "lucide-react"
import * as React from "react"

import {
  CommandDrawer,
  CommandDrawerContent,
  CommandDrawerGroup,
  CommandDrawerItem,
  CommandDrawerNest,
} from "@charlotte-ui/labs/command-drawer"

const meta: Meta = {
  title: "Labs/Command Drawer",
  component: CommandDrawer,
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  tags: ["autodocs"],
}

export default meta

// ─── Default (flat menu) ─────────────────────────────────────────────────

export const Default: StoryObj = {
  render: () => {
    const [open, setOpen] = React.useState(false)

    return (
      <>
        <button
          className="rounded-md border border-border bg-popover px-4 py-2 text-sm text-popover-foreground hover:bg-accent"
          onClick={() => setOpen(true)}
        >
          Open Drawer
        </button>
        <CommandDrawer open={open} onOpenChange={setOpen}>
          <CommandDrawerContent title="Menu">
            <CommandDrawerGroup>
              <CommandDrawerItem
                icon={<Calendar />}
                label="Calendar"
                onSelect={() => setOpen(false)}
              />
              <CommandDrawerItem
                icon={<Smile />}
                label="Search Emoji"
                description="Find the perfect emoji"
                onSelect={() => setOpen(false)}
              />
              <CommandDrawerItem
                icon={<Calculator />}
                label="Calculator"
                onSelect={() => setOpen(false)}
              />
            </CommandDrawerGroup>
            <CommandDrawerGroup>
              <CommandDrawerItem
                icon={<User />}
                label="Profile"
                onSelect={() => setOpen(false)}
              />
              <CommandDrawerItem
                icon={<CreditCard />}
                label="Billing"
                onSelect={() => setOpen(false)}
              />
              <CommandDrawerItem
                icon={<Settings />}
                label="Settings"
                onSelect={() => setOpen(false)}
              />
            </CommandDrawerGroup>
          </CommandDrawerContent>
        </CommandDrawer>
      </>
    )
  },
}

// ─── Nested (nest-in-nest, dynamic .map, destructive, height spring) ─────

const CONTACTS = [
  { id: "1", name: "Alice Chen" },
  { id: "2", name: "Bob Martinez" },
  { id: "3", name: "Carol Kim" },
]

export const Nested: StoryObj = {
  render: () => {
    const [open, setOpen] = React.useState(false)

    return (
      <>
        <button
          className="rounded-md border border-border bg-popover px-4 py-2 text-sm text-popover-foreground hover:bg-accent"
          onClick={() => setOpen(true)}
        >
          Open Nested Drawer
        </button>
        <CommandDrawer open={open} onOpenChange={setOpen}>
          <CommandDrawerContent title="Home" maxHeight={420}>
            {/* Static two-level nest */}
            <CommandDrawerGroup>
              <CommandDrawerNest
                label="Go to page"
                icon={<LayoutDashboard />}
              >
                <CommandDrawerGroup>
                  {["Dashboard", "Analytics", "Billing", "Team"].map((p) => (
                    <CommandDrawerItem
                      key={p}
                      icon={<LayoutDashboard />}
                      label={p}
                      onSelect={() => setOpen(false)}
                    />
                  ))}
                </CommandDrawerGroup>

                {/* Nest inside a nest (arbitrary depth) */}
                <CommandDrawerGroup>
                  <CommandDrawerNest
                    label="Settings"
                    icon={<Settings />}
                  >
                    <CommandDrawerGroup>
                      <CommandDrawerItem
                        icon={<Settings />}
                        label="General"
                        onSelect={() => setOpen(false)}
                      />
                      <CommandDrawerItem
                        icon={<Shield />}
                        label="Security"
                        onSelect={() => setOpen(false)}
                      />
                    </CommandDrawerGroup>
                  </CommandDrawerNest>
                </CommandDrawerGroup>
              </CommandDrawerNest>

              <CommandDrawerNest
                label="Open file"
                icon={<FolderOpen />}
              >
                <CommandDrawerGroup>
                  {["README.md", "package.json", "tsconfig.json"].map((f) => (
                    <CommandDrawerItem
                      key={f}
                      icon={<FileText />}
                      label={f}
                      onSelect={() => setOpen(false)}
                    />
                  ))}
                </CommandDrawerGroup>
              </CommandDrawerNest>
            </CommandDrawerGroup>

            {/* Dynamic nest — closures capture context naturally */}
            <CommandDrawerGroup>
              <CommandDrawerNest
                label="Show contacts"
                icon={<Users />}
              >
                {CONTACTS.map((contact) => (
                  <CommandDrawerNest
                    key={contact.id}
                    label={contact.name}
                    icon={<User />}
                  >
                    <CommandDrawerGroup>
                      <CommandDrawerItem
                        label="Send message"
                        onSelect={() => setOpen(false)}
                      />
                      <CommandDrawerItem
                        label="View profile"
                        onSelect={() => setOpen(false)}
                      />
                    </CommandDrawerGroup>
                  </CommandDrawerNest>
                ))}
              </CommandDrawerNest>
            </CommandDrawerGroup>

            {/* Flat items + destructive */}
            <CommandDrawerGroup>
              <CommandDrawerItem
                icon={<User />}
                label="Profile"
                onSelect={() => setOpen(false)}
              />
              <CommandDrawerItem
                icon={<CreditCard />}
                label="Billing"
                onSelect={() => setOpen(false)}
              />
              <CommandDrawerItem
                icon={<Trash2 />}
                label="Delete account"
                destructive
                onSelect={() => setOpen(false)}
              />
            </CommandDrawerGroup>
          </CommandDrawerContent>
        </CommandDrawer>
      </>
    )
  },
}
