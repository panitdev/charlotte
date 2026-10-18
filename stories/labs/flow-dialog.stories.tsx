import type { Meta, StoryObj } from "@storybook/react"
import {
  Bell,
  CheckCircle2,
  CreditCard,
  LogOut,
  Shield,
  Sparkles,
  User,
} from "lucide-react"
import * as React from "react"

import { ActionRow, ActionRowGroup } from "@charlotte-ui/labs/action-row"
import { Button } from "@charlotte-ui/button"
import {
  FlowDialog,
  FlowDialogBack,
  FlowDialogHeading,
} from "@charlotte-ui/labs/flow-dialog"

const meta: Meta<typeof FlowDialog> = {
  title: "Labs/Flow Dialog",
  component: FlowDialog,
  tags: ["autodocs"],
}

export default meta

function OpenButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="rounded-md border border-border bg-popover px-4 py-2 text-sm text-popover-foreground hover:bg-accent"
      onClick={onClick}
    >
      Open dialog
    </button>
  )
}

// ─── Menu → panel ─────────────────────────────────────────────────────────
//
// The common shape: a root view that is a menu of ActionRows, and one view per
// destination. Each row just sets `view` — FlowDialog crossfades and tweens the
// surface to the new content's height. Note how different the three panels are
// in height; nothing in the dialog is told about that.

export const Default: StoryObj<typeof FlowDialog> = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    const [view, setView] = React.useState("root")

    return (
      <>
        <OpenButton
          onClick={() => {
            setView("root")
            setOpen(true)
          }}
        />
        <FlowDialog open={open} onOpenChange={setOpen} view={view} title="Settings">
          {view === "root" ? (
            <div className="flex flex-col gap-4">
              <FlowDialogHeading
                title="Settings"
                description="Manage your account and how it behaves."
              />
              <ActionRowGroup>
                <ActionRow
                  icon={<User />}
                  label="Profile"
                  description="Name and username"
                  chevron
                  onSelect={() => setView("profile")}
                />
                <ActionRow
                  icon={<Shield />}
                  label="Security"
                  description="Password and two-factor"
                  chevron
                  onSelect={() => setView("security")}
                />
                <ActionRow
                  icon={<Bell />}
                  label="Notifications"
                  description="What we email you about"
                  chevron
                  onSelect={() => setView("notifications")}
                />
              </ActionRowGroup>
              <ActionRowGroup>
                <ActionRow
                  icon={<LogOut />}
                  label="Sign out"
                  destructive
                  onSelect={() => setOpen(false)}
                />
              </ActionRowGroup>
            </div>
          ) : view === "profile" ? (
            <div>
              <FlowDialogHeading
                title="Profile"
                description="This is how you appear to other people."
              />
              <div className="flex flex-col gap-3.5">
                <label className="flex flex-col gap-1.5 text-[13px] font-medium">
                  Display name
                  <input
                    defaultValue="Ada Lovelace"
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-primary/20 transition focus:border-primary focus:ring-4"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-[13px] font-medium">
                  Username
                  <input
                    defaultValue="ada"
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-primary/20 transition focus:border-primary focus:ring-4"
                  />
                </label>
              </div>
              <div className="mt-[22px]">
                <Button fullWidth onClick={() => setView("root")}>
                  Save changes
                </Button>
              </div>
              <FlowDialogBack onClick={() => setView("root")} />
            </div>
          ) : view === "security" ? (
            <div>
              <FlowDialogHeading
                title="Security"
                description="Two-factor is on for this account."
              />
              <div className="flex flex-col items-center gap-2 py-2 text-center">
                <CheckCircle2 className="size-10 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Nothing needs your attention right now.
                </p>
              </div>
              <FlowDialogBack onClick={() => setView("root")} />
            </div>
          ) : (
            <div>
              <FlowDialogHeading title="Notifications" />
              <ActionRowGroup>
                <ActionRow icon={<Sparkles />} label="Product updates" chevron />
                <ActionRow icon={<Shield />} label="Security alerts" chevron />
                <ActionRow icon={<CreditCard />} label="Billing receipts" chevron />
                <ActionRow icon={<Bell />} label="Everything else" chevron />
              </ActionRowGroup>
              <FlowDialogBack onClick={() => setView("root")} />
            </div>
          )}
        </FlowDialog>
      </>
    )
  },
}

// ─── Single view ──────────────────────────────────────────────────────────
//
// `view` never changes here, so nothing crossfades — but the height animation
// still runs, so content that grows or shrinks in place resizes the dialog.

export const SingleView: StoryObj<typeof FlowDialog> = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    const [expanded, setExpanded] = React.useState(false)

    return (
      <>
        <OpenButton onClick={() => setOpen(true)} />
        <FlowDialog open={open} onOpenChange={setOpen} view="only" title="Release notes">
          <FlowDialogHeading
            title="What's new"
            description="Version 2.4 — shipped this morning."
          />
          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm text-muted-foreground">
            <li>Faster cold starts on every plan.</li>
            <li>Passphrase recovery is out of beta.</li>
            {expanded && (
              <>
                <li>Audit log exports as CSV.</li>
                <li>Dark mode respects per-window theme.</li>
                <li>Fixed a drag-handle jump on iOS Safari.</li>
              </>
            )}
          </ul>
          <div className="mt-[22px]">
            <Button fullWidth onClick={() => setExpanded((v) => !v)}>
              {expanded ? "Show less" : "Show everything"}
            </Button>
          </div>
        </FlowDialog>
      </>
    )
  },
}

// ─── Non-dismissible ──────────────────────────────────────────────────────
//
// Escape, outside clicks, and the close button are all withheld — the flow has
// to finish. Use this for anything the app cannot proceed without.

export const NonDismissible: StoryObj<typeof FlowDialog> = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    const [view, setView] = React.useState("ask")

    return (
      <>
        <OpenButton
          onClick={() => {
            setView("ask")
            setOpen(true)
          }}
        />
        <FlowDialog
          open={open}
          onOpenChange={setOpen}
          view={view}
          title="Accept terms"
          dismissible={false}
        >
          {view === "ask" ? (
            <div>
              <FlowDialogHeading
                title="One more thing"
                description="We updated the terms of service. Accepting takes a second."
              />
              <Button fullWidth onClick={() => setView("done")}>
                Accept and continue
              </Button>
            </div>
          ) : (
            <div>
              <FlowDialogHeading title="All set" />
              <div className="flex flex-col items-center gap-2 py-2 text-center">
                <CheckCircle2 className="size-10 text-primary" />
                <p className="text-sm text-muted-foreground">Thanks — you're good to go.</p>
              </div>
              <div className="mt-[22px]">
                <Button fullWidth onClick={() => setOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </FlowDialog>
      </>
    )
  },
}

// ─── Mobile ───────────────────────────────────────────────────────────────
//
// Under 640px the same dialog renders as a vaul bottom sheet, height animation
// and all.

export const Mobile: StoryObj<typeof FlowDialog> = {
  ...Default,
  parameters: { viewport: { defaultViewport: "mobile1" } },
}
