"use client"

import * as React from "react"
import { AlertDialog as AlertDialogPrimitive } from "radix-ui"

import { Button } from "@charlotte-ui/button"
import { cn } from "@charlotte-ui/utils"

import { SquircleFallback } from "./squircle.js"

// ─── Parts ────────────────────────────────────────────────────────────────────

/**
 * A modal that interrupts the user to confirm or cancel an action.
 *
 * Unlike `Dialog`, it cannot be dismissed by clicking outside and has no close
 * button: the user has to answer it with `AlertDialogAction` or
 * `AlertDialogCancel` (Escape counts as cancel). Focus starts on the cancel
 * button.
 *
 * On small screens it is a bottom sheet that slides in like `Dialog`'s drawer,
 * but it is laid out in CSS rather than built on vaul, so it cannot be dragged
 * away and keeps the alert dialog's semantics.
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
        sheetMotion,
        className
      )}
      {...props}
    />
  )
}

// vaul's drawer timing, so the sheet moves like `Dialog` does on small screens.
// From `sm` up the default 150ms/200ms `ease` comes back.
const sheetMotion =
  "duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] sm:duration-150 sm:ease-[ease]"

/**
 * The panel, rendered in a portal over an overlay: a bottom sheet on small
 * screens, centered from `sm` up.
 */
function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      {/* The clip-path fallback would also round the sheet's bottom corners,
          so it only runs where the panel is centered. */}
      <SquircleFallback media="(min-width: 640px)">
        <AlertDialogPrimitive.Content
          data-slot="alert-dialog-content"
          className={cn(
            // Bottom sheet
            "fixed right-0 bottom-0 left-0 z-50 grid w-full gap-4 rounded-t-[calc(var(--radius)+4px)] border bg-background p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-lg outline-none",
            "supports-[corner-shape:squircle]:[corner-shape:squircle] supports-[corner-shape:squircle]:rounded-t-[2.25rem]",
            "data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom",
            sheetMotion,
            // Centered from `sm` up
            "sm:top-[50%] sm:right-auto sm:bottom-auto sm:left-[50%] sm:max-w-md sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-3xl sm:pb-6 sm:duration-200",
            "sm:supports-[corner-shape:squircle]:rounded-[2.25rem]",
            "sm:data-[state=open]:slide-in-from-bottom-0 sm:data-[state=open]:fade-in-0 sm:data-[state=open]:zoom-in-95 sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=closed]:fade-out-0 sm:data-[state=closed]:zoom-out-95",
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

/**
 * Confirms and closes. Renders a `Button`, so it takes `variant`, `size` and
 * `loading` (`variant="destructive"` for irreversible actions). It closes as
 * soon as it is clicked; to wait on async work, control `open`, call
 * `event.preventDefault()` in `onClick` and set `loading` while it runs.
 *
 * With `asChild` the child replaces the `Button`, so
 * `<AlertDialogAction asChild><Button/></AlertDialogAction>` still works.
 */
function AlertDialogAction({
  asChild,
  variant = "default",
  size = "sm",
  ...props
}: React.ComponentProps<typeof Button>) {
  if (asChild) {
    return <AlertDialogPrimitive.Action data-slot="alert-dialog-action" asChild {...props} />
  }
  return (
    <AlertDialogPrimitive.Action asChild>
      <Button data-slot="alert-dialog-action" variant={variant} size={size} {...props} />
    </AlertDialogPrimitive.Action>
  )
}

/**
 * Dismisses without acting; takes focus when the dialog opens. Renders an
 * outline `Button` by default.
 */
function AlertDialogCancel({
  asChild,
  variant = "outline",
  size = "sm",
  ...props
}: React.ComponentProps<typeof Button>) {
  if (asChild) {
    return <AlertDialogPrimitive.Cancel data-slot="alert-dialog-cancel" asChild {...props} />
  }
  return (
    <AlertDialogPrimitive.Cancel asChild>
      <Button data-slot="alert-dialog-cancel" variant={variant} size={size} {...props} />
    </AlertDialogPrimitive.Cancel>
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
