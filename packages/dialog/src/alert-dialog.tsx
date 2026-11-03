"use client"

import * as React from "react"
import { AlertDialog as AlertDialogPrimitive } from "radix-ui"

import { buttonVariants } from "@charlotte-ui/button"
import { cn } from "@charlotte-ui/utils"

import { SquircleFallback, squircleClassName } from "./squircle.js"

type ButtonSkin = NonNullable<Parameters<typeof buttonVariants>[0]>

// ─── Parts ────────────────────────────────────────────────────────────────────

/**
 * A modal that interrupts the user to confirm or cancel an action.
 *
 * Unlike `Dialog`, it cannot be dismissed by clicking outside, has no close
 * button, and stays centered on small screens rather than becoming a drawer:
 * the user has to answer it with `AlertDialogAction` or `AlertDialogCancel`
 * (Escape counts as cancel). Focus starts on the cancel button.
 */
function AlertDialog(props: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger(
  props: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>
) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
}

function AlertDialogPortal(
  props: React.ComponentProps<typeof AlertDialogPrimitive.Portal>
) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

/** The centered panel, rendered in a portal over an overlay. */
function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <SquircleFallback>
        <AlertDialogPrimitive.Content
          data-slot="alert-dialog-content"
          className={cn(
            "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-3xl border bg-background p-6 shadow-lg duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-md",
            squircleClassName,
            className
          )}
          {...props}
        />
      </SquircleFallback>
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

/** Stacks the buttons full-width on small screens, primary action on top. */
function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

type AlertDialogButtonProps = {
  variant?: ButtonSkin["variant"]
  size?: ButtonSkin["size"]
}

/**
 * Confirms and closes. Wears the `Button` skin (`variant="destructive"` for
 * irreversible actions). It closes as soon as it is clicked; to wait on async
 * work, control `open` and call `event.preventDefault()` in `onClick`.
 *
 * With `asChild` it passes straight through unstyled, so
 * `<AlertDialogAction asChild><Button/></AlertDialogAction>` is not
 * double-styled.
 */
function AlertDialogAction({
  className,
  variant = "default",
  size = "sm",
  asChild,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> & AlertDialogButtonProps) {
  return (
    <AlertDialogPrimitive.Action
      data-slot="alert-dialog-action"
      asChild={asChild}
      className={asChild ? className : cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

/** Dismisses without acting; takes focus when the dialog opens. Outline by default. */
function AlertDialogCancel({
  className,
  variant = "outline",
  size = "sm",
  asChild,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> & AlertDialogButtonProps) {
  return (
    <AlertDialogPrimitive.Cancel
      data-slot="alert-dialog-cancel"
      asChild={asChild}
      className={asChild ? className : cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
