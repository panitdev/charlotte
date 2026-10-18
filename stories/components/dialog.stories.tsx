import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { Button } from "@charlotte-ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@charlotte-ui/dialog"

const meta: Meta = {
  title: "Components/Dialog",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj

export const DestructiveConfirmation: Story = {
  render: function DestructiveDemo() {
    const [open, setOpen] = React.useState(false)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="destructive">
            Delete workspace
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete workspace</DialogTitle>
            <DialogDescription>
              This will permanently delete the workspace and all its data. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button size="sm" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button size="sm" variant="destructive" onClick={() => setOpen(false)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
}

export const FormDialog: Story = {
  render: function FormDemo() {
    const [open, setOpen] = React.useState(false)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Invite member
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite team member</DialogTitle>
            <DialogDescription>
              Send an invite link to a new member. They will be added to your workspace
              immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-foreground" htmlFor="invite-email">
              Email address
            </label>
            <input
              id="invite-email"
              type="email"
              placeholder="colleague@company.com"
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            />
          </div>
          <DialogFooter showCloseButton>
            <Button size="sm" onClick={() => setOpen(false)}>
              Send invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
}

export const BothVariants: Story = {
  render: function BothDemo() {
    const [deleteOpen, setDeleteOpen] = React.useState(false)
    const [formOpen, setFormOpen] = React.useState(false)
    return (
      <div className="flex flex-wrap items-start gap-3">
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="destructive">
              Delete workspace
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete workspace</DialogTitle>
              <DialogDescription>
                This will permanently delete the workspace and all its data. This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button size="sm" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button size="sm" variant="destructive" onClick={() => setDeleteOpen(false)}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              Invite member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite team member</DialogTitle>
              <DialogDescription>
                Send an invite link to a new member. They will be added to your workspace
                immediately.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-foreground" htmlFor="invite-email-both">
                Email address
              </label>
              <input
                id="invite-email-both"
                type="email"
                placeholder="colleague@company.com"
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              />
            </div>
            <DialogFooter showCloseButton>
              <Button size="sm" onClick={() => setFormOpen(false)}>
                Send invite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  },
}
