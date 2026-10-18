import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { FileText, FolderTree, Globe, Terminal } from "lucide-react"

import {
  AgentMessage,
  AgentStep,
  AgentRun,
  AgentThinking,
  type AgentStepState,
  type AgentRunItem,
  type AgentThinkingMode,
} from "@charlotte-ui/labs/agent-run"

const meta: Meta<typeof AgentRun> = {
  title: "Labs/Agent Run",
  component: AgentRun,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    nodeSize: { control: { type: "range", min: 32, max: 96, step: 4 } },
    lineWidth: { control: { type: "range", min: 1, max: 6, step: 0.5 } },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-xl">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof AgentRun>

/** All node states side by side, no streaming. */
export const States: Story = {
  args: { nodeSize: 64, lineWidth: 2 },
  render: (args) => (
    <AgentRun {...args}>
      <AgentStep state="success" title="Read file" meta="registry.json · 6.9 KB" icon={FileText} />
      <AgentStep
        state="success"
        title="List directory"
        meta="packages/labs/src"
        icon={FolderTree}
        defaultOpen
      >
        19 files
      </AgentStep>
      <AgentStep state="running" title="Run command" meta="bun run lint" icon={Terminal} />
      <AgentStep state="error" title="Fetch URL" meta="503 · timed out after 30s" icon={Globe} />
      <AgentStep state="pending" title="Publish install URL" meta="waiting" />
    </AgentRun>
  ),
}

/** Prose and tool calls sharing one continuous line. */
export const WithMessages: Story = {
  args: { nodeSize: 64, lineWidth: 2 },
  render: (args) => (
    <AgentRun {...args}>
      <AgentMessage>
        I'll add the animated agent timeline component. First let me look at how the
        existing registry items are structured.
      </AgentMessage>
      <AgentStep state="success" title="Read file" meta="AGENTS.md" icon={FileText} />
      <AgentStep
        state="success"
        title="List directory"
        meta="packages/labs/src"
        icon={FolderTree}
        defaultOpen
      >
        Found 19 existing components.
      </AgentStep>
      <AgentMessage>
        The components use framer-motion with a shared easing constant. I'll follow
        the same convention and wire the reveal to a single motion value per row.
      </AgentMessage>
      <AgentStep state="running" title="Write file" meta="agent-run.tsx" icon={FileText} />
    </AgentRun>
  ),
}

const REASONING =
  "The registry manifest is the source of truth for what CI publishes, so the component has to be listed there before the install URL will resolve. The existing entries all point at a single file under packages/labs/src and declare their npm dependencies explicitly, which means framer-motion and lucide-react both need to be named. The shared easing constant lives in @charlotte-ui/utils, so that has to be declared too rather than inlined. Nothing else in the manifest needs touching — the generated index is built by CI from this file."

/**
 * Reasoning folded behind a header. The block starts collapsed, and opening or
 * closing it animates the body's height with the timeline's line tracking it.
 */
export const Thinking: Story = {
  args: { nodeSize: 64, lineWidth: 2 },
  render: (args) => (
    <AgentRun {...args}>
      <AgentMessage>
        I&apos;ll add the timeline component and register it.
      </AgentMessage>
      <AgentThinking title="Thought for 4s">{REASONING}</AgentThinking>
      <AgentThinking title="Open by default" defaultMode="expanded">
        {REASONING}
      </AgentThinking>
      <AgentThinking title="Peeking at the last lines" defaultMode="peek">
        {REASONING}
      </AgentThinking>
      <AgentStep state="success" title="Read file" meta="registry.json" icon={FileText} />
      <AgentStep state="running" title="Write file" meta="agent-run.tsx" icon={FileText} />
      {/* Last row: the only case where the trail line would otherwise ease
          instead of tracking the fold, so it is worth having on screen. */}
      <AgentThinking title="Still thinking">{REASONING}</AgentThinking>
    </AgentRun>
  ),
}

/**
 * Tool calls fold open. Any of the three sections is optional — a description
 * of what the call does, the arguments it was given, the output it returned —
 * and a call with none of them has no chevron and does not open at all.
 *
 * The header keeps the node's height either way, so the title never drifts off
 * the ring beside it; only the body below moves, and the timeline's line tracks
 * that movement frame by frame.
 */
export const ExpansibleTools: Story = {
  args: { nodeSize: 64, lineWidth: 2 },
  render: (args) => (
    <AgentRun {...args}>
      <AgentMessage>Checking how the registry wires components up.</AgentMessage>
      <AgentStep
        state="success"
        title="Read file"
        meta="registry.json"
        icon={FileText}
        description="Reads the registry manifest to see how existing entries declare their dependencies."
        arguments={'{\n  "path": "registry.json",\n  "offset": 0\n}'}
        defaultOpen
      >
        6.9 KB · 313 lines
      </AgentStep>
      {/* Nothing to fold away — no chevron, and the header is not a button. */}
      <AgentStep state="success" title="List directory" meta="packages/labs/src" icon={FolderTree} />
      {/* Arguments only, closed until clicked. */}
      <AgentStep
        state="running"
        title="Run command"
        meta="bun run lint"
        icon={Terminal}
        arguments={'{\n  "command": "bun run lint",\n  "cwd": "/charlotte"\n}'}
      />
      <AgentStep
        state="error"
        title="Fetch URL"
        meta="503 · timed out after 30s"
        icon={Globe}
        description="Publishes the generated install URL so a fresh shadcn add resolves it."
        arguments={'{\n  "url": "https://registry.npmjs.org/@charlotte-ui/labs"\n}'}
        defaultOpen
      >
        Service Unavailable — the endpoint returned 503 three times before the
        30s budget ran out. Nothing was written.
      </AgentStep>
    </AgentRun>
  ),
}

/**
 * `revealOnMount={false}` — the timeline as HISTORY rather than an entrance.
 *
 * A reveal batch costs the SUM of its rows' durations, so a restored turn would
 * otherwise spend seconds drawing itself before the last row lands. Switching
 * sessions or navigating back wants the run already on screen. Rows that stream
 * in afterwards still reveal normally.
 */
export const Restored: Story = {
  args: { nodeSize: 64, lineWidth: 2, revealOnMount: false },
  render: (args) => (
    <AgentRun {...args}>
      <AgentMessage>
        I&apos;ll add the animated agent timeline component. First let me look at how the
        existing registry items are structured.
      </AgentMessage>
      <AgentThinking title="Thought for 4s">{REASONING}</AgentThinking>
      <AgentStep state="success" title="Read file" meta="AGENTS.md" icon={FileText} />
      <AgentStep
        state="success"
        title="List directory"
        meta="packages/labs/src"
        icon={FolderTree}
        defaultOpen
      >
        Found 19 existing components.
      </AgentStep>
      <AgentStep state="error" title="Fetch URL" meta="503 · timed out after 30s" icon={Globe} />
      <AgentMessage>Done — component added and registry updated.</AgentMessage>
    </AgentRun>
  ),
}

/**
 * The fold driven from outside the component: `collapsed` + `onCollapsedChange`
 * make it controlled, so the app decides — here, an "expand all" toggle that
 * opens and closes every block at once.
 */
export const ThinkingControlled: Story = {
  args: { nodeSize: 64, lineWidth: 2 },
  render: (args) => {
    const [mode, setMode] = React.useState<Record<string, AgentThinkingMode>>({
      a: "collapsed",
      b: "collapsed",
    })
    const allOpen = ["a", "b"].every((id) => mode[id] === "expanded")
    const setAll = (next: AgentThinkingMode) => setMode({ a: next, b: next })

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAll(allOpen ? "collapsed" : "expanded")}
            className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
          <button
            type="button"
            onClick={() => setAll("peek")}
            className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            Peek all
          </button>
        </div>
        <AgentRun {...args}>
          <AgentThinking
            title="Planning the change"
            mode={mode.a}
            onModeChange={(next) => setMode((p) => ({ ...p, a: next }))}
          >
            {REASONING}
          </AgentThinking>
          <AgentStep state="success" title="Read file" meta="registry.json" icon={FileText} />
          <AgentThinking
            title="Checking the manifest"
            mode={mode.b}
            onModeChange={(next) => setMode((p) => ({ ...p, b: next }))}
          >
            {REASONING}
          </AgentThinking>
          <AgentStep state="running" title="Run command" meta="bun run lint" icon={Terminal} />
        </AgentRun>
      </div>
    )
  },
}

/**
 * `peek` while the model is still reasoning: the block shows the newest few
 * lines, scrolls itself to the latest one, and fades out where it is cut off —
 * so a long chain of thought never takes over the timeline.
 *
 * It also shows the transition only the app can drive. A click expands the
 * block fully; the NEXT click would normally collapse it, but here the app
 * knows the stream is still live, so it sends the block back to `peek`
 * instead. Once streaming ends, clicks fold it away as usual.
 */
export const ThinkingStreamed: Story = {
  args: { nodeSize: 64, lineWidth: 2 },
  render: (args) => {
    const [text, setText] = React.useState("")
    const [streaming, setStreaming] = React.useState(true)
    const [mode, setMode] = React.useState<AgentThinkingMode>("peek")
    const runRef = React.useRef(0)

    const run = React.useCallback(() => {
      const runId = ++runRef.current
      setText("")
      setStreaming(true)
      setMode("peek")
      const tokens = REASONING.match(/\S+\s*/g) ?? []
        ; (async () => {
          for (const token of tokens) {
            await new Promise((r) => setTimeout(r, 45))
            if (runRef.current !== runId) return
            setText((prev) => prev + token)
          }
          setStreaming(false)
        })()
    }, [])

    React.useEffect(() => {
      run()
      return () => {
        runRef.current++
      }
    }, [run])

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={run}
            className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            Replay
          </button>
          <span className="text-xs text-muted-foreground">
            {streaming ? "streaming…" : "done"} · mode: {mode}
          </span>
        </div>
        <AgentRun {...args}>
          <AgentMessage>Working out what the registry needs.</AgentMessage>
          <AgentThinking
            title={streaming ? "Thinking" : "Thought for 8s"}
            mode={mode}
            // The component proposes collapse when expanded; the app overrides
            // it while the stream is live, because only the app knows that.
            onModeChange={(next) =>
              setMode(next === "collapsed" && streaming ? "peek" : next)
            }
          >
            {text}
          </AgentThinking>
          <AgentStep
            state={streaming ? "pending" : "running"}
            title="Write file"
            meta="registry.json"
            icon={FileText}
          />
        </AgentRun>
      </div>
    )
  },
}

/** Maps tool names from the stream to how they render on the timeline. */
const toolPresentation: Record<
  string,
  {
    title: string
    icon: React.ComponentType<{ className?: string }>
    description: string
    meta: (input: unknown) => string | undefined
  }
> = {
  read_file: {
    title: "Read file",
    icon: FileText,
    description: "Reads a file from the workspace and returns its contents.",
    meta: (input) => (input as { path?: string } | undefined)?.path,
  },
  list_directory: {
    title: "List directory",
    icon: FolderTree,
    description: "Lists the entries of a directory, one level deep.",
    meta: (input) => (input as { path?: string } | undefined)?.path,
  },
  run_command: {
    title: "Run command",
    icon: Terminal,
    description: "Runs a shell command in the workspace and captures its output.",
    meta: (input) => (input as { command?: string } | undefined)?.command,
  },
  fetch_url: {
    title: "Fetch URL",
    icon: Globe,
    description: "Fetches a URL over HTTP and returns the response body.",
    meta: (input) => (input as { url?: string } | undefined)?.url,
  },
}

/**
 * Plays the consumer's role: the app owns its conversation state (fed by
 * whatever LLM API it uses) and maps it into `AgentRunItem[]`. The
 * append / patch helpers below stand in for that mapping layer, driven at a
 * real stream's cadence — token-by-token text, tool calls raised moments
 * apart within one turn and running in parallel, results resolving out of
 * order. `renderTool` turns tool names + inputs into presentation — including
 * the description and arguments behind each call's fold.
 *
 * The fold is controlled here too: a call opens while it runs and folds itself
 * away when it succeeds, but one that FAILS stays open, because a failure is
 * the case you want to read. Clicking still wins — the app just writes the
 * click back onto the item.
 */
export const LLMStreaming: Story = {
  args: { nodeSize: 64, lineWidth: 2 },
  render: (args) => {
    const [items, setItems] = React.useState<AgentRunItem[]>([])
    const runRef = React.useRef(0)
    // Which thinking items are still receiving tokens. The app knows this; the
    // component cannot, which is the whole reason the mode is controlled here.
    const streamingIds = React.useRef(new Set<string>())

    const handleThinkingMode = React.useCallback(
      (id: string, next: AgentThinkingMode) => {
        setItems((prev) =>
          prev.map((item) =>
            item.id === id && item.kind === "thinking"
              ? {
                  ...item,
                  // A click on an expanded block normally collapses it — but
                  // while reasoning is still arriving, drop back to the peeking
                  // window instead of hiding it outright.
                  mode:
                    next === "collapsed" && streamingIds.current.has(id) ? "peek" : next,
                }
              : item
          )
        )
      },
      []
    )

    const handleToolOpen = React.useCallback((id: string, open: boolean) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id && item.kind === "tool" ? { ...item, open } : item))
      )
    }, [])

    const run = React.useCallback(() => {
      const runId = ++runRef.current
      const alive = () => runRef.current === runId
      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
      setItems([])

      const append = (item: AgentRunItem) => {
        if (alive()) setItems((prev) => [...prev, item])
      }
      const patch = (id: string, up: (item: AgentRunItem) => AgentRunItem) => {
        if (alive()) setItems((prev) => prev.map((item) => (item.id === id ? up(item) : item)))
      }
      // A settled call folds away; a failed one stays open to be read.
      const resolve = (id: string, state: AgentStepState, result?: string) =>
        patch(id, (item) => ({ ...item, state, result, open: state === "error" }) as AgentRunItem)

      // Text arrives a token at a time; the message item grows in place.
      const streamText = async (id: string, text: string) => {
        append({ kind: "message", id, text: "" })
        for (const token of text.match(/\S+\s*/g) ?? []) {
          await sleep(30 + Math.random() * 40)
          if (!alive()) return
          patch(id, (item) =>
            item.kind === "message" ? { ...item, text: item.text + token } : item
          )
        }
      }

      // Reasoning streams the same way. Open the block mid-stream and the text
      // keeps growing under it — the fold animates, the growth doesn't.
      const streamThinking = async (id: string, text: string) => {
        const started = Date.now()
        streamingIds.current.add(id)
        // Peeks while it streams: visible, but capped at a few lines.
        append({ kind: "thinking", id, text: "", title: "Thinking", mode: "peek" })
        for (const token of text.match(/\S+\s*/g) ?? []) {
          await sleep(20 + Math.random() * 30)
          if (!alive()) return
          patch(id, (item) =>
            item.kind === "thinking" ? { ...item, text: item.text + token } : item
          )
        }
        streamingIds.current.delete(id)
        // Reasoning is done and the turn moves on, so it folds away — unless the
        // user has opened it in the meantime.
        patch(id, (item) =>
          item.kind === "thinking"
            ? {
                ...item,
                title: `Thought for ${Math.round((Date.now() - started) / 1000)}s`,
                mode: item.mode === "expanded" ? "expanded" : "collapsed",
              }
            : item
        )
      }

        ; (async () => {
          await sleep(300)
          // Turn 1 — reasoning, prose, then two tool calls raised in the same turn.
          await streamThinking("th1", REASONING)
          await sleep(250)
          await streamText("m1", "I'll check how the registry wires up components before adding the timeline.")
          await sleep(350)
          append({ kind: "tool", id: "t1", name: "read_file", state: "running", input: { path: "registry.json" }, open: true })
          await sleep(140)
          append({ kind: "tool", id: "t2", name: "list_directory", state: "running", input: { path: "packages/labs/src" }, open: true })
          // Both run in parallel; results come back out of order.
          await sleep(800)
          resolve("t2", "success", "Found 19 existing components.")
          await sleep(700)
          resolve("t1", "success")

          // Turn 2 — more prose, another pair of calls; one fails.
          await sleep(400)
          await streamText("m2", "The registry looks consistent. Running lint and checking the publish endpoint in parallel.")
          await sleep(300)
          append({ kind: "tool", id: "t3", name: "run_command", state: "running", input: { command: "bun run lint" }, open: true })
          await sleep(180)
          append({ kind: "tool", id: "t4", name: "fetch_url", state: "running", input: { url: "https://registry.npmjs.org" }, open: true })
          await sleep(1100)
          resolve("t4", "error", "503 · timed out after 30s")
          await sleep(600)
          resolve("t3", "success")

          // Final turn — a long closing summary that wraps many times, so the
          // last row's line has to ease its height repeatedly as prose streams in.
          await sleep(400)
          await streamText(
            "m3",
            "Lint passes and the component is registered in the registry manifest, so a fresh install will pick it up once the endpoint is reachable again. The publish endpoint is down right now — the fetch above timed out with a 503 after thirty seconds — so the generated install URL will need a retry once it recovers. Nothing else in the run depends on it: the timeline renders from the local component, the stories build cleanly, and the reveal animation drives the whole chain off a single progress value per row. When the endpoint comes back, re-running the publish step is enough; there is no state to reconcile and no partial write to clean up, because the manifest is only committed after the upload succeeds."
          )
        })()
    }, [])

    React.useEffect(() => {
      run()
      return () => {
        runRef.current++
      }
    }, [run])

    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={run}
          className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          Replay
        </button>
        <AgentRun
          {...args}
          items={items}
          onThinkingModeChange={handleThinkingMode}
          onToolOpenChange={handleToolOpen}
          renderTool={(item) => {
            const p = toolPresentation[item.name]
            if (!p) return {}
            return {
              title: p.title,
              icon: p.icon,
              meta: p.meta(item.input),
              description: p.description,
              // A string, not an element: `AgentStep` is memoized, and a node
              // built fresh on every streamed token would defeat that.
              arguments: JSON.stringify(item.input, null, 2),
            }
          }}
        />
      </div>
    )
  },
}

const script: Array<{
  id: number
  title: string
  meta: string
  icon: React.ComponentType<{ className?: string }>
  message?: string
}> = [
    { id: 1, title: "Read file", meta: "AGENTS.md", icon: FileText },
    { id: 2, title: "List directory", meta: "packages/labs/src", icon: FolderTree },
    { id: 3, title: "Run command", meta: "bun run lint", icon: Terminal },
    { id: 4, title: "Fetch URL", meta: "registry.npmjs.org", icon: Globe },
  ]

type Row = (typeof script)[number] & { state: AgentStepState }

/**
 * A turn that streams in: each row appears in a running state, resolves, and the
 * next begins — with the line and node animating in as each row arrives.
 */
export const Streaming: Story = {
  args: { nodeSize: 64, lineWidth: 2 },
  render: (args) => {
    const [rows, setRows] = React.useState<Row[]>([])
    const [done, setDone] = React.useState(false)

    const run = React.useCallback(() => {
      setRows([])
      setDone(false)
      const timers: ReturnType<typeof setTimeout>[] = []
      let t = 400
      script.forEach((step, i) => {
        // Row streams in, running.
        timers.push(
          setTimeout(() => setRows((r) => [...r, { ...step, state: "running" }]), t)
        )
        t += 1100
        // Row resolves — the fetch fails, everything else succeeds.
        timers.push(
          setTimeout(
            () =>
              setRows((r) =>
                r.map((row) =>
                  row.id === step.id
                    ? { ...row, state: step.id === 4 ? "error" : "success" }
                    : row
                )
              ),
            t
          )
        )
        t += 500
        if (i === script.length - 1) {
          timers.push(setTimeout(() => setDone(true), t))
        }
      })
      return () => timers.forEach(clearTimeout)
    }, [])

    React.useEffect(() => run(), [run])

    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={run}
          className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          Replay
        </button>
        <AgentRun {...args}>
          <AgentMessage>
            Setting up the agent timeline — running through the registry to match
            conventions before writing the component.
          </AgentMessage>
          {rows.map((row) => (
            <AgentStep
              key={row.id}
              state={row.state}
              title={row.title}
              meta={row.meta}
              icon={row.icon}
            />
          ))}
          {done ? <AgentMessage>Done — component added and registry updated.</AgentMessage> : null}
        </AgentRun>
      </div>
    )
  },
}

/**
 * The path a real consumer takes: a stream applies ONE event per React commit,
 * so a burst of tool calls that arrive together still mounts as several separate
 * commits a millisecond or two apart — not as one list rendered at once, which is
 * what most of the stories above do.
 *
 * This is the story to watch when touching the reveal coordinator. The whole
 * burst must read as ONE continuous stroke — and it must not take one row's
 * reveal per row to get through: ten parallel calls whose results all landed at
 * once have to sweep in, or an evenly paced draw is still just a queue. Ten
 * rows, compositional children and the compact defaults, because that is what
 * the failure was reported against.
 */
export const BurstStreaming: Story = {
  args: { nodeSize: 40, lineWidth: 1.5 },
  render: (args) => {
    const [rows, setRows] = React.useState<Row[]>([])
    const pending = React.useRef<ReturnType<typeof setTimeout>[]>([])
    // Ten calls issued in parallel, as a model does when it fans out.
    const burst = React.useMemo(
      () => Array.from({ length: 10 }, (_, i) => ({ ...script[i % script.length], id: i + 1 })),
      []
    )

    const run = React.useCallback(() => {
      pending.current.forEach(clearTimeout)
      setRows([])
      const timers: ReturnType<typeof setTimeout>[] = (pending.current = [])
      // One row per commit, ~2ms apart: near-simultaneous in wall-clock time,
      // but each in its own React commit — the shape a stream reducer produces.
      burst.forEach((step, i) => {
        timers.push(
          setTimeout(
            () => setRows((r) => [...r, { ...step, state: "running" }]),
            400 + i * 2
          )
        )
        // Results land while the tip is still working its way down, which is the
        // usual case for calls this cheap — a row must not seal its ring before
        // the stroke has reached it.
        timers.push(
          setTimeout(
            () =>
              setRows((r) =>
                r.map((row) =>
                  row.id === step.id
                    ? { ...row, state: step.id === 4 ? "error" : "success" }
                    : row
                )
              ),
            700 + i * 2
          )
        )
      })
    }, [burst])

    React.useEffect(() => {
      run()
      return () => pending.current.forEach(clearTimeout)
    }, [run])

    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={run}
          className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          Replay
        </button>
        <AgentRun {...args}>
          {rows.map((row) => (
            <AgentStep
              key={row.id}
              state={row.state}
              title={row.title}
              meta={row.meta}
              icon={row.icon}
            />
          ))}
        </AgentRun>
      </div>
    )
  },
}

/**
 * Every row mounts `pending` and is resolved later, which is what a consumer
 * streaming a run actually does: the row is created the moment a tool call is
 * announced and only learns its outcome afterwards. This is the one path where
 * the node changes COLOUR after mount — pending's muted ring becoming primary or
 * destructive — so it is the story to watch when touching the ring's stroke or
 * the trail's tint. {@link Streaming} does change state after mount, but only
 * running -> success, and those two share a colour.
 */
export const PendingThenResolved: Story = {
  args: { nodeSize: 64, lineWidth: 2 },
  render: (args) => {
    const [states, setStates] = React.useState<AgentStepState[]>(() =>
      script.map(() => "pending")
    )

    // Replaying must cancel the run in flight — this is the story you sit in
    // front of while debugging the node's colours, and a leaked timer from the
    // previous run repainting mid-replay is exactly the confusion it must not add.
    const pending = React.useRef<ReturnType<typeof setTimeout>[]>([])

    const run = React.useCallback(() => {
      pending.current.forEach(clearTimeout)
      setStates(script.map(() => "pending"))
      const timers: ReturnType<typeof setTimeout>[] = (pending.current = [])
      let t = 900
      script.forEach((step, i) => {
        const set = (state: AgentStepState) =>
          setStates((s) => s.map((prev, j) => (j === i ? state : prev)))
        timers.push(setTimeout(() => set("running"), t))
        t += 1100
        timers.push(setTimeout(() => set(step.id === 4 ? "error" : "success"), t))
        t += 500
      })
      return () => timers.forEach(clearTimeout)
    }, [])

    React.useEffect(() => run(), [run])

    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={run}
          className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          Replay
        </button>
        <AgentRun {...args}>
          {script.map((step, i) => (
            <AgentStep
              key={step.id}
              state={states[i]}
              title={step.title}
              meta={step.meta}
              icon={step.icon}
            />
          ))}
        </AgentRun>
      </div>
    )
  },
}
