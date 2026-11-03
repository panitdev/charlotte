"use client"

import * as React from "react"
import { Slot } from "radix-ui"
import { Squircle } from "@squircle-js/react"

// ─── Squircle corners ─────────────────────────────────────────────────────────
//
// Native `corner-shape: squircle` where the browser has it (applied in CSS via
// `supports-[corner-shape:squircle]:`), otherwise @squircle-js/react clips the
// element to a squircle path. The clip-path fallback also clips the shadow and
// the outer edge of the border at the corners — a trade-off for older engines.

const subscribeNoop = () => () => { }

function useSupportsCornerShape(): boolean {
  return React.useSyncExternalStore(
    subscribeNoop,
    () => CSS.supports("corner-shape", "squircle"),
    // Assume native support on the server; CSS falls back to plain rounding
    () => true
  )
}

function useMediaQuery(query: string | undefined): boolean {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      if (!query) return () => {}
      const mq = window.matchMedia(query)
      mq.addEventListener("change", onChange)
      return () => mq.removeEventListener("change", onChange)
    },
    [query]
  )
  return React.useSyncExternalStore(
    subscribe,
    () => !query || window.matchMedia(query).matches,
    () => true
  )
}

const SQUIRCLE_RADIUS = 24
const SQUIRCLE_SMOOTHING = 0.8

// The native squircle hugs the corner tighter than figma-style smoothing, so it
// takes a larger radius to read as the same shape.
export const squircleClassName =
  "supports-[corner-shape:squircle]:[corner-shape:squircle] supports-[corner-shape:squircle]:rounded-[2.25rem]"

// DialogPortal wraps each child in Presence, which needs the child's ref to
// hold it mounted through the exit animation — so whatever Presence/Portal pass
// down has to reach the content element. The inner Slot composes that ref with
// Squircle's own measuring ref instead of letting Squircle overwrite it.
export function SquircleFallback({
  children,
  media,
  ...props
}: React.ComponentProps<typeof Slot.Root> & {
  children: React.ReactElement
  /** Only clip while this media query matches */
  media?: string
}) {
  const native = useSupportsCornerShape()
  const matches = useMediaQuery(media)
  if (native || !matches) return <Slot.Root {...props}>{children}</Slot.Root>
  // `duration-200` on the content leaves `transition-property` at its `all`
  // default, which would ease every clip-path write and leave the clip trailing
  // a resizing surface. Enter/exit run on keyframes, so nothing else is lost.
  return (
    <Squircle
      asChild
      cornerRadius={SQUIRCLE_RADIUS}
      cornerSmoothing={SQUIRCLE_SMOOTHING}
      style={{ transitionProperty: "none" }}
    >
      <Slot.Root {...props}>{children}</Slot.Root>
    </Squircle>
  )
}
