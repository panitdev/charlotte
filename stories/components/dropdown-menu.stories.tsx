import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
  Check,
  Gauge,
  Globe,
  LogOut,
  Monitor,
  Moon,
  Settings,
  Subtitles,
  Sun,
  Trash2,
  Undo2,
  User,
} from "lucide-react"

import { Button } from "@charlotte-ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@charlotte-ui/dropdown-menu"

const meta: Meta<typeof DropdownMenuTrigger> = {
  title: "Components/Dropdown Menu",
  component: DropdownMenuTrigger,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "outline", "secondary", "ghost"],
    },
    size: { control: "inline-radio", options: ["xs", "sm", "default", "lg"] },
  },
}

export default meta
type Story = StoryObj<typeof DropdownMenuTrigger>

/** A bare trigger wears the button skin, so no wrapper is needed. */
export const Default: Story = {
  render: (args) => (
    <DropdownMenu>
      <DropdownMenuTrigger {...args}>Account</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User />
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

/**
 * Clicking a sub-menu replaces the panel in place instead of flying one out
 * beside the menu: the old panel slides off, the new one slides in, and the
 * surface tweens between the two heights. The back row, `Escape`, `ArrowLeft`
 * and a selection all pop one level — only the root panel closes on select.
 */
export const ClickToReplaceSubmenus: Story = {
  render: () => {
    const [quality, setQuality] = React.useState("1080p")
    const [captions, setCaptions] = React.useState(true)

    return (
      <DropdownMenu>
        <DropdownMenuTrigger variant="ghost" size="icon-sm" aria-label="Settings">
          <Settings />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[15rem]">
          <DropdownMenuCheckboxItem
            checked={captions}
            onCheckedChange={setCaptions}
            onSelect={(event) => event.preventDefault()}
          >
            <Subtitles />
            Captions
          </DropdownMenuCheckboxItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Gauge />
              Quality
              <span className="ml-auto text-xs text-muted-foreground">
                {quality}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={quality} onValueChange={setQuality}>
                {["2160p", "1440p", "1080p", "720p", "480p", "360p"].map(
                  (value) => (
                    <DropdownMenuRadioItem key={value} value={value}>
                      {value}
                    </DropdownMenuRadioItem>
                  )
                )}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Globe />
              Language
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>
                English
                <Check className="ml-auto" />
              </DropdownMenuItem>
              <DropdownMenuItem>한국어</DropdownMenuItem>
              <DropdownMenuItem>日本語</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>More…</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Deutsch</DropdownMenuItem>
                  <DropdownMenuItem>Español</DropdownMenuItem>
                  <DropdownMenuItem>Français</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}

/**
 * Selecting an item in a nested panel returns to the panel it came from instead
 * of closing the menu — the default. The root panel has nowhere to go back to,
 * so selecting there closes, and so does a click outside.
 */
export const NestedSelectGoesBack: Story = {
  render: () => {
    const [quality, setQuality] = React.useState("1080p")

    return (
      <DropdownMenu>
        <DropdownMenuTrigger variant="outline">Settings</DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Gauge />
              Quality
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={quality} onValueChange={setQuality}>
                {["2160p", "1080p", "720p"].map((value) => (
                  <DropdownMenuRadioItem key={value} value={value}>
                    {value}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}

/**
 * `backOnSelect={false}` restores close-on-select, so a nested pick leaves the
 * menu the way a plain shadcn menu would.
 */
export const CloseOnSelect: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger variant="outline">Quality</DropdownMenuTrigger>
      <DropdownMenuContent align="start" backOnSelect={false}>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Gauge />
            Quality
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>2160p</DropdownMenuItem>
            <DropdownMenuItem>1080p</DropdownMenuItem>
            <DropdownMenuItem>720p</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

/**
 * `backTrigger` replaces the built-in back row, which sits above the panel's
 * items by default. It is handed the destination's label, the `back` action and
 * the placement; marking the row `data-dropdown-menu-autofocus` is what lets it
 * take focus as a panel opens.
 */
export const CustomBackRow: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger variant="outline">View</DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        backTrigger={({ label, back }) => (
          <DropdownMenuItem
            data-dropdown-menu-autofocus=""
            onSelect={(event) => {
              event.preventDefault()
              back()
            }}
            className="mb-1 text-muted-foreground"
          >
            <Undo2 />
            Back to {label}
          </DropdownMenuItem>
        )}
      >
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Gauge />
            Quality
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>2160p</DropdownMenuItem>
            <DropdownMenuItem>1080p</DropdownMenuItem>
            <DropdownMenuItem>720p</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

/** `backTriggerPosition="bottom"` puts the back row below the panel's items. */
export const BackRowOnBottom: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger variant="outline">Settings</DropdownMenuTrigger>
      <DropdownMenuContent align="start" backTriggerPosition="bottom">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Gauge />
            Quality
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>2160p</DropdownMenuItem>
            <DropdownMenuItem>1080p</DropdownMenuItem>
            <DropdownMenuItem>720p</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

/**
 * The default `backTriggerPosition="auto"` keeps the back row on the edge nearest
 * the trigger. The trigger sits at the bottom here, so the menu opens upwards and
 * the row lands below the items.
 */
export const BackRowAuto: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="flex min-h-screen items-end justify-center p-6">
      <DropdownMenu>
        <DropdownMenuTrigger variant="outline">Settings</DropdownMenuTrigger>
        <DropdownMenuContent align="center" backTriggerPosition="auto">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Gauge />
              Quality
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>2160p</DropdownMenuItem>
              <DropdownMenuItem>1080p</DropdownMenuItem>
              <DropdownMenuItem>720p</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
}

/** `asChild` passes through unstyled, so existing shadcn call sites keep working. */
export const CustomTrigger: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>New file</DropdownMenuItem>
        <DropdownMenuItem>New window</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2 />
          Delete project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

/** Checkbox and radio items, including a radio group living in a sub-menu. */
export const Selections: Story = {
  render: () => {
    const [theme, setTheme] = React.useState("system")
    const [sidebar, setSidebar] = React.useState(true)
    const [statusBar, setStatusBar] = React.useState(false)

    return (
      <DropdownMenu>
        <DropdownMenuTrigger variant="secondary">View</DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={sidebar}
            onCheckedChange={setSidebar}
            onSelect={(event) => event.preventDefault()}
          >
            Sidebar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={statusBar}
            onCheckedChange={setStatusBar}
            onSelect={(event) => event.preventDefault()}
          >
            Status bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {theme === "light" ? <Sun /> : theme === "dark" ? <Moon /> : <Monitor />}
              Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}

/**
 * `expandTriggerToMenuWidth` widens the trigger to the open menu and tweens it
 * back on close, with the menu never narrower than the trigger. Panels of
 * different widths carry the trigger along with them.
 */
export const TriggerExpandsToMenu: Story = {
  render: (args) => (
    <DropdownMenu expandTriggerToMenuWidth>
      <DropdownMenuTrigger {...args}>Share</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>
          <User />
          Invite people to this workspace
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Globe />
            Publish to the web
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Anyone</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Nobody</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2 />
          Revoke every link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

/**
 * The trigger's own content can change while it carries the expanded width —
 * showing the value just picked, say. The shrink on close has to find the
 * trigger's new natural width rather than the one it had before the pick, or it
 * tweens back to the old size and snaps.
 */
export const TriggerExpandsToSelectedValue: Story = {
  render: () => {
    const [unit, setUnit] = React.useState("Kilometres")
    const units = ["Kilometres", "Miles", "Nautical miles", "Light years"]

    return (
      <DropdownMenu expandTriggerToMenuWidth>
        <DropdownMenuTrigger variant="outline">{unit}</DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuRadioGroup value={unit} onValueChange={setUnit}>
            {units.map((value) => (
              <DropdownMenuRadioItem key={value} value={value}>
                {value}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}

/**
 * The trigger's own content can also be wider than the menu body — a long
 * selected value against short option labels. The menu's width is a floor under
 * the trigger, not a width it shrinks back to, so the trigger keeps its width
 * instead of being crushed down to the menu's, and the menu's floor follows it
 * up so the two still meet.
 */
export const TriggerWiderThanMenu: Story = {
  render: () => {
    const [unit, setUnit] = React.useState("Km")
    const units: Array<[string, string]> = [
      ["Km", "Km"],
      ["Mi", "Mi"],
      ["Nautical miles per fortnight", "NM/fn"],
    ]

    return (
      <DropdownMenu expandTriggerToMenuWidth>
        <DropdownMenuTrigger variant="outline">{unit}</DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Unit</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={unit} onValueChange={setUnit}>
                {units.map(([value, label]) => (
                  <DropdownMenuRadioItem key={value} value={value}>
                    {label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}

export const TriggerExpandsLeftAligned: Story = {
  parameters: { layout: "fullscreen" },
  render: () => {
    const [unit, setUnit] = React.useState("Kilometres")
    const units = ["Kilometres", "Miles", "Nautical miles", "Light years"]

    return (
      <div className="flex items-center gap-3 p-6">
        <DropdownMenu expandTriggerToMenuWidth>
          <DropdownMenuTrigger variant="outline">{unit}</DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuRadioGroup value={unit} onValueChange={setUnit}>
              {units.map((value) => (
                <DropdownMenuRadioItem key={value} value={value}>
                  {value}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <span id="marker" className="text-sm text-muted-foreground">
          next
        </span>
      </div>
    )
  },
}
