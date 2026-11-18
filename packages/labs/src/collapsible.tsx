"use client"

import type * as React from "react"
import { ChevronDown } from "lucide-react"
import { Collapsible as CollapsiblePrimitive } from "radix-ui"

import { Button } from "@charlotte-ui/button"
import { cn, DEFAULT_EASE } from "@charlotte-ui/utils"

/** Outlined disclosure surface with controlled and uncontrolled open state. */
function Collapsible({ className, ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="collapsible"
      className={cn(
        "rounded-[23px] border border-border bg-card motion-safe:transition-shadow",
        "data-[state=closed]:shadow-[0_1px_2px_oklch(0_0_0_/_0.04)] data-[state=closed]:hover:shadow-[0_2px_5px_oklch(0_0_0_/_0.08)]",
        className
      )}
      {...props}
    />
  )
}

/**
 * Toggles the disclosure from the full header row with Charlotte's Liquid Glass
 * press effect and a chevron that rotates when open.
 * Set `fullWidth` to align the label and chevron at opposite ends.
 * Use `asChild` to supply your own trigger.
 */
function CollapsibleTrigger({
  asChild,
  children,
  className,
  fullWidth = false,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Trigger> & { fullWidth?: boolean }) {
  if (asChild) {
    return (
      <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" asChild className={className} {...props}>
        {children}
      </CollapsiblePrimitive.Trigger>
    )
  }

  return (
    <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" asChild {...props}>
      <Button
        variant="ghost"
        fullWidth
        className={cn(
          "group/collapsible-trigger h-[44px] transform-none! rounded-[22px] px-4 font-semibold hover:bg-transparent focus-visible:ring-inset",
          "data-[state=open]:rounded-b-none data-[state=open]:hover:bg-muted/60",
          // Keep the pill lens above the animating body while the press effect is visible.
          "has-[[data-slot=button-glass]]:z-10 [&>[data-slot=button-glass]]:rounded-full",
          className
        )}
      >
        <span className={cn("flex w-full min-w-0 items-center gap-2 px-4 text-start", fullWidth && "justify-between")}>
          <span className={fullWidth ? "min-w-0 truncate" : undefined}>{children}</span>
          <ChevronDown
            aria-hidden="true"
            className="text-muted-foreground transition-transform group-data-[state=open]/collapsible-trigger:rotate-180 motion-reduce:transition-none"
          />
        </span>
      </Button>
    </CollapsiblePrimitive.Trigger>
  )
}

const contentStyle = { "--collapsible-ease": `cubic-bezier(${DEFAULT_EASE.join(", ")})` } as React.CSSProperties

/**
 * Clips overflow as the panel changes height, fades, and slides. Respects reduced-motion preferences.
 * The default inner padding collapses with the panel. Use `asChild` to supply your own layout.
 */
function CollapsibleContent({
  asChild,
  children,
  className,
  style,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Content>) {
  return (
    <CollapsiblePrimitive.Content
      asChild={asChild}
      data-slot="collapsible-content"
      style={{ ...contentStyle, ...style }}
      className={cn(
        "overflow-clip",
        "motion-safe:data-[state=open]:animate-[collapsible-down_250ms_var(--collapsible-ease),enter_250ms_var(--collapsible-ease)] motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=open]:slide-in-from-top-[4px]",
        "motion-safe:data-[state=closed]:animate-[collapsible-up_200ms_var(--collapsible-ease),exit_200ms_var(--collapsible-ease)] motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=closed]:slide-out-to-top-[4px]",
        className
      )}
      {...props}
    >
      {asChild ? children : <div className="px-4 pb-4">{children}</div>}
    </CollapsiblePrimitive.Content>
  )
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
