"use client"

import * as React from "react"
import { useReducedMotion } from "framer-motion"

/**
 * Streamed prose, paced and faded in.
 *
 * Text from an LLM does not arrive at the rate it should be read. Proxies, TLS
 * records and the fetch buffer clump tokens together, a cold start can hold a
 * thousand tokens back and release them in one event, and a stalled connection
 * does the same mid-stream. Appending each update as it lands makes the prose
 * stutter, then jump.
 *
 * `StreamText` decouples the two. Every `text` it receives goes into a buffer;
 * a drain loop takes words off the front of that buffer every `tick`, at a rate
 * proportional to how far behind it is (`backlog / maxLag`, never below
 * `minRate`), and fades each word in. A steady stream reads as a steady flow,
 * and the display never trails arrival by much more than `maxLag`.
 *
 * Trickling a large burst would mean deliberately holding back text that has
 * already arrived. So when the backlog would take longer than `burstThreshold`
 * to drain at the current input rate, it is shown at once instead, faded in as
 * paragraph-sized groups. A cold-start burst or the release after a stall
 * appears immediately; ordinary streaming keeps its rhythm.
 *
 * The component only ever sees strings. It does not know where they come from,
 * and it does not need to: the caller appends to `text` and, when it knows,
 * says the stream has ended with `streaming={false}` so the tail drains faster.
 *
 * The DOM under the span is written directly, never through React state, so a
 * drain tick never causes a render. Words whose fade has finished are merged
 * back into one text node, which keeps the node count bounded however long the
 * text grows. Text present when the component mounts is shown as-is (it was
 * already on screen, or it is history), and so is any `text` that does not
 * extend the previous one. Under `prefers-reduced-motion`, or with `instant`,
 * every update is shown as it arrives — exactly a plain text node.
 *
 * Text that has to be rendered richly, such as Markdown, cannot go through a
 * span the component writes itself. {@link useStreamText} is the same pacing
 * as a hook that returns the prefix to show, for the app to render however it
 * likes; {@link streamWords} and {@link StreamFade} give that rendering the
 * fade, one element per word.
 */

export type StreamTextOptions = {
  /** How often the buffer is drained, in ms. Defaults to 40. */
  tick?: number
  /**
   * How far the display may trail arrival while streaming, in ms. The drain
   * rate scales so the backlog clears within this window. Defaults to 300.
   */
  maxLag?: number
  /** The same bound once `streaming` is `false`. Defaults to 100. */
  finishLag?: number
  /** Floor on the drain rate, in characters per second. Defaults to 40. */
  minRate?: number
  /** Fade-in duration of each word, in ms. Defaults to 260. */
  fade?: number
  /**
   * Delay between consecutive words of one drain, in ms. Capped so that one
   * drain's cascade ends within `tick`. Defaults to 14.
   */
  stagger?: number
  /**
   * Blur the fade starts from, in px. Defaults to 0: an opacity-only fade is
   * the cheapest to composite, while a blur costs a filter pass per word.
   */
  blur?: number
  /** CSS easing of the fade. */
  easing?: string
  /**
   * Backlog, expressed as the ms it would take to drain at the current input
   * rate, beyond which it is shown at once in paragraph groups instead of
   * trickled. `false` always trickles. Defaults to 300.
   */
  burstThreshold?: number | false
  /** Delay between the paragraphs of one burst group, in ms. Defaults to 40. */
  burstStagger?: number
  /** Fade-in duration of a burst group, in ms. Defaults to 220. */
  burstFade?: number
}

export const STREAM_TEXT_DEFAULTS: Required<StreamTextOptions> = {
  tick: 40,
  maxLag: 300,
  finishLag: 100,
  minRate: 40,
  fade: 260,
  stagger: 14,
  blur: 0,
  easing: "cubic-bezier(0.2, 0.6, 0.3, 1)",
  burstThreshold: 300,
  burstStagger: 40,
  burstFade: 220,
}

type Resolved = Required<StreamTextOptions>

/** Fills defaults and clamps values that would stall or spin the drain loop. */
export function resolveStreamTextOptions(o?: StreamTextOptions): Resolved {
  const r = { ...STREAM_TEXT_DEFAULTS }
  if (o) for (const k in o) {
    const v = o[k as keyof StreamTextOptions]
    if (v !== undefined) (r as Record<string, unknown>)[k] = v
  }
  r.tick = Math.max(8, r.tick)
  r.maxLag = Math.max(16, r.maxLag)
  r.finishLag = Math.max(16, r.finishLag)
  r.minRate = Math.max(1, r.minRate)
  r.fade = Math.max(0, r.fade)
  r.stagger = Math.max(0, r.stagger)
  r.blur = Math.max(0, r.blur)
  r.burstStagger = Math.max(0, r.burstStagger)
  r.burstFade = Math.max(0, r.burstFade)
  return r
}

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

const RATE_WINDOW = 1000

/** Where a {@link Pacer} sends the text it releases. */
type Sink = {
  /**
   * `pieces` were just released, in order: words, or the paragraph groups of a
   * burst when `burst` is set.
   */
  reveal(pieces: string[], burst: boolean, now: number, o: Resolved): void
  /** `rest` shows at once with no fade, and anything still fading settles. */
  flush(rest: string): void
  /** The text was replaced rather than appended to; `text` shows as-is. */
  reset(text: string): void
  /** Called after every drain. Returns the ms until the sink next needs a wake, or -1. */
  settle(now: number): number
}

/**
 * The drain loop: decides how much of the text shows and when, and nothing
 * else. What showing means is up to its {@link Sink} — spans written straight
 * into the DOM for `StreamText`, a React state update for `useStreamText`.
 */
class Pacer {
  private src: string
  private shown: number
  private streaming: boolean | undefined = undefined
  private instant = false
  // Recent arrivals, for the input rate the burst test compares against.
  private arrivals: { t: number; n: number }[] = []
  private since = 0
  private timer: ReturnType<typeof setTimeout> | undefined
  private frame = 0
  private lastDrain = 0
  private attached = false

  constructor(
    private sink: Sink,
    initial: string,
    private o: Resolved
  ) {
    this.src = initial
    this.shown = initial.length
  }

  /** The prefix released so far. */
  get text() {
    return this.src.slice(0, this.shown)
  }

  setOptions(o: Resolved) {
    this.o = o
  }

  setInstant(instant: boolean) {
    this.instant = instant
    if (instant) this.flushAll()
  }

  attach() {
    this.attached = true
    this.lastDrain = performance.now()
    if (!this.since) this.since = this.lastDrain
    this.schedule(this.o.tick)
  }

  /** Stops the loop and settles everything, so a remount starts consistent. */
  detach() {
    this.attached = false
    this.cancel()
    this.flushAll()
  }

  update(text: string, streaming: boolean | undefined) {
    this.streaming = streaming
    if (text === this.src) return
    if (!text.startsWith(this.src)) {
      // Replaced or edited, not appended: there is nothing to reveal.
      this.cancel()
      this.src = text
      this.shown = text.length
      this.sink.reset(text)
      return
    }
    this.arrivals.push({ t: performance.now(), n: text.length - this.src.length })
    this.src = text
    if (this.instant) this.flushAll()
    else this.schedule(this.o.tick)
  }

  private flushAll() {
    const rest = this.src.slice(this.shown)
    this.shown = this.src.length
    this.sink.flush(rest)
  }

  private cancel() {
    if (this.timer !== undefined) clearTimeout(this.timer)
    if (this.frame) cancelAnimationFrame(this.frame)
    this.timer = undefined
    this.frame = 0
  }

  // A timeout wakes the loop and a frame does the write. Driving the loop from
  // rAF alone would wake the page at the display's refresh rate for the whole
  // stream; this wakes it once per tick, and not at all when there is nothing
  // to drain or settle.
  private schedule(delay: number) {
    if (!this.attached || this.timer !== undefined || this.frame) return
    this.timer = setTimeout(() => {
      this.timer = undefined
      this.frame = requestAnimationFrame(this.run)
    }, Math.max(0, delay))
  }

  private run = (now: number) => {
    this.frame = 0
    if (!this.attached) return
    const dt = Math.max(now - this.lastDrain, 1)
    this.lastDrain = now
    const backlog = this.src.length - this.shown

    if (backlog > 0) {
      const burst = this.o.burstThreshold
      if (burst !== false && backlog / this.inputRate(now) > burst) this.emitGroup(now)
      else this.emitWords(this.pickEnd(backlog, dt), now)
    }

    const wait = this.sink.settle(now)

    if (this.shown < this.src.length) this.schedule(this.o.tick)
    else if (wait >= 0) this.schedule(wait)
  }

  /**
   * Characters per ms received over the last second (or since mount, if
   * sooner). A window rather than per-update rates, because the update that
   * carries a burst would otherwise measure itself as a very fast stream —
   * here it only counts against the time it actually took to arrive.
   */
  private inputRate(now: number) {
    const from = Math.max(now - RATE_WINDOW, this.since)
    while (this.arrivals.length && this.arrivals[0].t < from) this.arrivals.shift()
    let n = 0
    for (const a of this.arrivals) n += a.n
    return Math.max(n / Math.max(now - from, this.o.tick), this.o.minRate / 1000)
  }

  /** How far to drain this tick, snapped to a word boundary. */
  private pickEnd(backlog: number, dt: number) {
    const s = this.src
    const lag = this.streaming === false ? this.o.finishLag : this.o.maxLag
    const rate = Math.max(backlog / lag, this.o.minRate / 1000)
    let end = Math.min(s.length, this.shown + Math.max(1, Math.round(rate * dt)))
    if (end < s.length) {
      const k = s.slice(end, end + 24).search(/\s/)
      if (k !== -1) end += k + 1
      else if (this.streaming !== false) {
        // The word is still arriving; stop before it rather than show half.
        const back = s.slice(this.shown, end).search(/\s\S*$/)
        if (back > 0) end = this.shown + back + 1
      }
    }
    // Never split a surrogate pair.
    const c = s.charCodeAt(end - 1)
    if (c >= 0xd800 && c <= 0xdbff && end < s.length) end++
    return end
  }

  private emitWords(end: number, now: number) {
    const chunk = this.src.slice(this.shown, end)
    this.shown = end
    this.sink.reveal(chunk.match(/\S+\s*|\s+/g) ?? [], false, now, this.o)
  }

  private emitGroup(now: number) {
    const chunk = this.src.slice(this.shown)
    this.shown = this.src.length
    // Paragraphs keep the blank line that ends them, so the joined text is unchanged.
    const parts = chunk.match(/[\s\S]*?(?:\n\s*\n|$)/g)?.filter(Boolean) ?? [chunk]
    this.sink.reveal(parts, true, now, this.o)
  }
}

type Live = { el: HTMLSpanElement; until: number; anim?: Animation }

/** `StreamText`'s sink. Owns the span's children. */
class DomSink implements Sink {
  private live: Live[] = []

  constructor(
    private root: HTMLElement,
    private settled: Text
  ) {}

  reveal(pieces: string[], burst: boolean, now: number, o: Resolved) {
    if (burst) {
      pieces.forEach((p, i) => this.spawn(p, i * o.burstStagger, o.burstFade, now, o))
      return
    }
    const step = Math.min(o.stagger, o.tick / Math.max(pieces.length, 1))
    pieces.forEach((w, i) => this.spawn(w, i * step, o.fade, now, o))
  }

  flush(rest: string) {
    if (this.live.length) {
      let add = ""
      for (const l of this.live) {
        l.anim?.cancel()
        add += l.el.textContent
        l.el.remove()
      }
      this.live = []
      this.settled.data += add
    }
    if (rest) this.settled.data += rest
  }

  reset(text: string) {
    for (const l of this.live) l.anim?.cancel()
    this.live = []
    this.root.replaceChildren(this.settled)
    this.settled.data = text
  }

  /** Merges words whose fade has finished into the leading text node. */
  settle(now: number) {
    let k = 0
    while (k < this.live.length && this.live[k].until <= now) k++
    if (k) {
      let add = ""
      for (let i = 0; i < k; i++) {
        add += this.live[i].el.textContent
        this.live[i].el.remove()
      }
      this.live.splice(0, k)
      this.settled.data += add
    }
    return this.live.length ? Math.max(this.live[0].until - performance.now(), 0) : -1
  }

  private spawn(text: string, delay: number, duration: number, now: number, o: Resolved) {
    const el = document.createElement("span")
    el.textContent = text
    this.root.append(el)
    let anim: Animation | undefined
    if (duration > 0 && typeof el.animate === "function") {
      const blur = o.blur
      anim = el.animate(
        blur > 0
          ? [{ opacity: 0, filter: `blur(${blur}px)` }, { opacity: 1, filter: "blur(0px)" }]
          : [{ opacity: 0 }, { opacity: 1 }],
        { duration, delay, easing: o.easing, fill: "backwards" }
      )
    }
    this.live.push({ el, anim, until: now + delay + duration + 16 })
  }
}

/** Options are usually an inline object; resolve them by value, not identity. */
function useResolvedOptions(options: StreamTextOptions | undefined) {
  const key = options ? JSON.stringify(options) : ""
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useMemo(() => resolveStreamTextOptions(options), [key])
}

export type UseStreamTextOptions = StreamTextOptions & {
  /** Whether more text is coming. As {@link StreamTextProps.streaming}. */
  streaming?: boolean
  /** Return every update as it arrives, with no pacing. */
  instant?: boolean
}

/**
 * The pacing of {@link StreamText} without its rendering: the same buffer,
 * drain and burst logic, returning the prefix of `text` to show right now.
 * Render it however the app renders text — through Markdown, say — and, for
 * the fade, wrap each word in its own element (see {@link streamWords} and
 * {@link StreamFade}).
 *
 * Unlike `StreamText`, this renders the calling component on every drain step,
 * every `tick` ms while there is a backlog. Text present on mount is returned
 * as-is, and so is any `text` that does not extend the previous one. Under
 * `prefers-reduced-motion`, or with `instant`, it returns `text` unchanged.
 */
export function useStreamText(
  text: string,
  { streaming, instant = false, ...options }: UseStreamTextOptions = {}
): string {
  const reduce = useReducedMotion()
  const [shown, setShown] = React.useState(text)
  const pacer = React.useRef<Pacer | null>(null)
  const resolved = useResolvedOptions(options)
  const skip = instant || !!reduce
  // Unpaced updates are returned straight from `text`; mirroring each one into
  // state as well would render twice per update for nothing.
  const skipRef = React.useRef(skip)
  skipRef.current = skip

  useIsoLayoutEffect(() => {
    if (!pacer.current) {
      const sync = () => {
        if (!skipRef.current) setShown(pacer.current!.text)
      }
      pacer.current = new Pacer(
        { reveal: sync, flush: sync, reset: sync, settle: () => -1 },
        text,
        resolved
      )
    }
    const p = pacer.current
    p.attach()
    return () => p.detach()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useIsoLayoutEffect(() => {
    const p = pacer.current!
    p.setOptions(resolved)
    p.setInstant(skip)
    p.update(text, streaming)
    // Catches up after `skip` turns off, and is a no-op otherwise.
    if (!skip) setShown(p.text)
  }, [text, streaming, skip, resolved])

  return skip ? text : shown
}

/** Class of a word element that fades in when it mounts. See {@link streamWords}. */
export const STREAM_WORD_CLASS = "cui-stream-word"

const SETTLED_ATTR = "data-cui-stream-settled"

const STREAM_WORD_CSS = `
@keyframes cui-stream-fade { from { opacity: 0 } }
@keyframes cui-stream-fade-blur { from { opacity: 0; filter: blur(var(--cui-stream-blur)) } }
.${STREAM_WORD_CLASS} {
  animation: var(--cui-stream-anim, cui-stream-fade) var(--cui-stream-fade, ${STREAM_TEXT_DEFAULTS.fade}ms)
    var(--cui-stream-easing, ${STREAM_TEXT_DEFAULTS.easing}) backwards;
}
[data-cui-stream-hold] .${STREAM_WORD_CLASS}, .${STREAM_WORD_CLASS}[${SETTLED_ATTR}] { animation: none }
@media (prefers-reduced-motion: reduce) { .${STREAM_WORD_CLASS} { animation: none } }
`

/**
 * Plain text as one element per word, each fading in as it mounts. React keeps
 * the elements it already has, so as `text` grows only the new words fade.
 *
 * Any renderer gets the same effect by giving each word of its output an
 * element with {@link STREAM_WORD_CLASS} — a Markdown renderer, with a plugin
 * that splits text nodes into such spans. The CSS comes with
 * {@link StreamFade}, which `AgentMessage` and `AgentThinking` already wrap
 * around `renderText`.
 */
export function streamWords(text: string): React.ReactNode {
  return (text.match(/\S+\s*|\s+/g) ?? []).map((w, i) => (
    <span key={i} className={STREAM_WORD_CLASS}>
      {w}
    </span>
  ))
}

export type StreamFadeProps = {
  /** Fade tuning: `fade`, `blur` and `easing` apply; the rest is pacing. */
  options?: StreamTextOptions
  children?: React.ReactNode
}

/**
 * Ships the CSS for {@link STREAM_WORD_CLASS} and tunes it for the words
 * inside. Words already present when it mounts are shown as-is, so restored
 * text does not fade in. It lays out as if it were not there
 * (`display: contents`).
 */
export function StreamFade({ options, children }: StreamFadeProps) {
  const o = useResolvedOptions(options)
  const ref = React.useRef<HTMLDivElement>(null)
  // Holds every fade back until the words of the first render are marked
  // settled. A passive effect is enough: the hold is in the first paint, and
  // nothing animates before it lifts.
  const [hold, setHold] = React.useState(true)
  React.useEffect(() => {
    ref.current
      ?.querySelectorAll(`.${STREAM_WORD_CLASS}`)
      .forEach((el) => el.setAttribute(SETTLED_ATTR, ""))
    setHold(false)
  }, [])

  return (
    <div
      ref={ref}
      className="contents"
      data-cui-stream-hold={hold ? "" : undefined}
      style={
        {
          "--cui-stream-fade": `${o.fade}ms`,
          "--cui-stream-easing": o.easing,
          ...(o.blur > 0 && {
            "--cui-stream-anim": "cui-stream-fade-blur",
            "--cui-stream-blur": `${o.blur}px`,
          }),
        } as React.CSSProperties
      }
    >
      {/* React 19 hoists this into <head> once, however many rows render it. */}
      <style href="charlotte-stream-word" precedence="default">
        {STREAM_WORD_CSS}
      </style>
      {children}
    </div>
  )
}

export type StreamTextProps = {
  /** The text so far. Append as it streams. */
  text: string
  /**
   * Whether more text is coming. `false` drains what is left within
   * `finishLag` instead of `maxLag`. Leave it undefined when the caller does
   * not know; the backlog still drains within `maxLag`.
   */
  streaming?: boolean
  /** Show every update as it arrives, with no pacing or fade. */
  instant?: boolean
  /** Pacing and fade tuning. Read on every render, so it may change live. */
  options?: StreamTextOptions
  className?: string
}

/** Streamed text, paced and faded in a word at a time. See the module docs. */
export function StreamText({ text, streaming, instant = false, options, className }: StreamTextProps) {
  const reduce = useReducedMotion()
  const ref = React.useRef<HTMLSpanElement>(null)
  const pacer = React.useRef<Pacer | null>(null)
  // The first text renders through React, so it is in the server HTML and on
  // the first paint. The prop never changes after that, so React never touches
  // the node again; the pacer adopts it and appends to it.
  const [initial] = React.useState(text)
  const resolved = useResolvedOptions(options)

  useIsoLayoutEffect(() => {
    const root = ref.current!
    if (!pacer.current) {
      let node = root.firstChild
      if (!(node instanceof Text)) {
        node = document.createTextNode(initial)
        root.replaceChildren(node)
      }
      pacer.current = new Pacer(new DomSink(root, node as Text), initial, resolved)
    }
    const p = pacer.current
    p.attach()
    return () => p.detach()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useIsoLayoutEffect(() => {
    const p = pacer.current!
    p.setOptions(resolved)
    p.setInstant(instant || !!reduce)
    p.update(text, streaming)
  }, [text, streaming, instant, reduce, resolved])

  return (
    <span ref={ref} className={className}>
      {initial}
    </span>
  )
}
