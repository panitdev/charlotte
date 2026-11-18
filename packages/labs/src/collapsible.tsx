"use client"

import type * as React from "react"
import { ChevronDown } from "lucide-react"
import { Collapsible as CollapsiblePrimitive } from "radix-ui"

import { Button } from "@charlotte-ui/button"
import { cn, DEFAULT_EASE } from "@charlotte-ui/utils"

/** Groups a disclosure trigger and its content. Supports controlled and uncontrolled open state. */
function Collapsible(props: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

/**
 * Toggles the disclosure. The default trigger uses Charlotte's ghost Button
 * with its Liquid Glass press effect and a chevron that rotates when open.
 * Use `asChild` to supply your own trigger.
 */
function CollapsibleTrigger({
  asChild,
  children,
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Trigger>) {
  if (asChild) {
    return (
      <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" asChild className={className} {...props}>
        {children}
      </CollapsiblePrimitive.Trigger>
    )
  }

  return (
    <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" asChild {...props}>
      <Button variant="ghost" className={cn("group/collapsible-trigger", className)}>
        {children}
        <ChevronDown
          aria-hidden="true"
          className="text-muted-foreground transition-transform group-data-[state=open]/collapsible-trigger:rotate-180 motion-reduce:transition-none"
        />
      </Button>
    </CollapsiblePrimitive.Trigger>
  )
}

const contentStyle = { "--collapsible-ease": `cubic-bezier(${DEFAULT_EASE.join(", ")})` } as React.CSSProperties

/** Animates height and opacity without clipping overflow. Respects reduced-motion preferences. */
function CollapsibleContent({
  className,
  style,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Content>) {
  return (
    <CollapsiblePrimitive.Content
      data-slot="collapsible-content"
      style={{ ...contentStyle, ...style }}
      className={cn(
        "motion-safe:data-[state=open]:animate-[collapsible-down_250ms_var(--collapsible-ease),enter_250ms_var(--collapsible-ease)] motion-safe:data-[state=open]:fade-in-0",
        "motion-safe:data-[state=closed]:animate-[collapsible-up_200ms_var(--collapsible-ease),exit_200ms_var(--collapsible-ease)] motion-safe:data-[state=closed]:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
