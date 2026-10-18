import type { Meta, StoryObj } from "@storybook/react"
import { KeyRound, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react"
import * as React from "react"

import { Button } from "@charlotte-ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableFooter,
  TableHead,
  TableHeader,
  TableLoading,
  TableRow,
  TableRowActions,
  type SortDirection,
  type TableDensity,
} from "@charlotte-ui/table"

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-[720px] p-6">
        <Story />
      </div>
    ),
  ],
}

export default meta

// ─── Data ─────────────────────────────────────────────────────────────────

type Credential = { id: string; name: string; suffix: string; added: string }

const apiKeys: Credential[] = [
  { id: "1", name: "MiniMax", suffix: "••••ioVE", added: "2026-08-15" },
  { id: "2", name: "OpenCode Public", suffix: "••••blic", added: "2026-08-15" },
  { id: "3", name: "CommandCode", suffix: "••••bMVd", added: "2026-08-15" },
]

const sshKeys: Credential[] = [
  { id: "4", name: "Cloud", suffix: "SHA256:…x9Qk", added: "2026-08-15" },
]

type Run = { id: string; agent: string; status: string; tokens: number; cost: number }

const runs: Run[] = [
  { id: "r1", agent: "planner", status: "Done", tokens: 18_204, cost: 0.41 },
  { id: "r2", agent: "coder", status: "Done", tokens: 96_512, cost: 2.17 },
  { id: "r3", agent: "reviewer", status: "Failed", tokens: 7_340, cost: 0.16 },
  { id: "r4", agent: "coder", status: "Running", tokens: 41_009, cost: 0.92 },
  { id: "r5", agent: "tester", status: "Done", tokens: 12_880, cost: 0.29 },
]

// ─── Section header (story helper) ────────────────────────────────────────

function Section({
  title,
  description,
  action,
  children,
}: {
  title: string
  description: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function CredentialTable({ rows, keyLabel }: { rows: Credential[]; keyLabel: string }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="w-40">{keyLabel}</TableHead>
          <TableHead className="w-28">Added</TableHead>
          <TableHead className="w-px">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableEmpty
            colSpan={4}
            icon={<KeyRound />}
            title="No keys yet"
            description="Add a key to use it from models and hosts."
          />
        ) : (
          rows.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {c.suffix}
              </TableCell>
              <TableCell className="text-muted-foreground">{c.added}</TableCell>
              <TableCell align="end">
                <TableRowActions>
                  <Button variant="ghost" size="icon-xs" aria-label={`Delete ${c.name}`}>
                    <Trash2 />
                  </Button>
                </TableRowActions>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

// ─── Credentials (settings page) ──────────────────────────────────────────
//
// One framed surface per section, hairline dividers, real columns. The delete
// action appears on row hover or focus instead of floating 500px away.

export const Credentials: StoryObj<typeof Table> = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-semibold">Credentials</h2>
        <p className="text-sm text-muted-foreground">
          Encrypted secrets used by models and SSH hosts. Only the last four characters ever come
          back.
        </p>
      </div>
      <Section
        title="API keys"
        description="Provider credentials used by models."
        action={
          <Button variant="outline" size="xs">
            <Plus /> Add key
          </Button>
        }
      >
        <CredentialTable rows={apiKeys} keyLabel="Key" />
      </Section>
      <Section
        title="SSH keys"
        description="Private keys used to connect to remote hosts."
        action={
          <Button variant="outline" size="xs">
            <Plus /> Add key
          </Button>
        }
      >
        <CredentialTable rows={sshKeys} keyLabel="Fingerprint" />
      </Section>
    </div>
  ),
}

// ─── Plain shadcn usage ───────────────────────────────────────────────────
//
// Nothing but the shadcn parts — code written against shadcn's table renders
// unchanged.

export const ShadcnCompatible: StoryObj<typeof Table> = {
  render: () => (
    <Table>
      <TableCaption>A list of recent agent runs.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Agent</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Cost</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {runs.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-medium">{r.agent}</TableCell>
            <TableCell>{r.status}</TableCell>
            <TableCell className="text-right">${r.cost.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right">
            ${runs.reduce((s, r) => s + r.cost, 0).toFixed(2)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}

// ─── Sorting + selection ──────────────────────────────────────────────────

type SortKey = "agent" | "tokens" | "cost"

export const SortAndSelect: StoryObj<typeof Table> = {
  render: () => {
    const [sort, setSort] = React.useState<{ key: SortKey; dir: "asc" | "desc" }>({
      key: "cost",
      dir: "desc",
    })
    const [selected, setSelected] = React.useState<Set<string>>(new Set(["r2"]))

    const sorted = [...runs].sort((a, b) => {
      const av = a[sort.key]
      const bv = b[sort.key]
      const cmp = typeof av === "number" ? av - (bv as number) : String(av).localeCompare(String(bv))
      return sort.dir === "asc" ? cmp : -cmp
    })

    const dirFor = (key: SortKey): SortDirection => (sort.key === key ? sort.dir : false)
    const toggleSort = (key: SortKey) =>
      setSort((s) =>
        s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" },
      )
    const toggleRow = (id: string) =>
      setSelected((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
    const all = selected.size === runs.length

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <input
                type="checkbox"
                role="checkbox"
                aria-label="Select all"
                className="size-4 accent-primary align-middle"
                checked={all}
                ref={(el) => {
                  if (el) el.indeterminate = selected.size > 0 && !all
                }}
                onChange={() => setSelected(all ? new Set() : new Set(runs.map((r) => r.id)))}
              />
            </TableHead>
            <TableHead sortDirection={dirFor("agent")} onSort={() => toggleSort("agent")}>
              Agent
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead
              align="end"
              sortDirection={dirFor("tokens")}
              onSort={() => toggleSort("tokens")}
            >
              Tokens
            </TableHead>
            <TableHead align="end" sortDirection={dirFor("cost")} onSort={() => toggleSort("cost")}>
              Cost
            </TableHead>
            <TableHead className="w-px">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((r) => (
            <TableRow key={r.id} data-state={selected.has(r.id) ? "selected" : undefined}>
              <TableCell>
                <input
                  type="checkbox"
                  role="checkbox"
                  aria-label={`Select ${r.agent} run`}
                  className="size-4 accent-primary align-middle"
                  checked={selected.has(r.id)}
                  onChange={() => toggleRow(r.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{r.agent}</TableCell>
              <TableCell className="text-muted-foreground">{r.status}</TableCell>
              <TableCell align="end">{r.tokens.toLocaleString("en-US")}</TableCell>
              <TableCell align="end">${r.cost.toFixed(2)}</TableCell>
              <TableCell align="end">
                <TableRowActions>
                  <Button variant="ghost" size="icon-xs" aria-label="Edit">
                    <Pencil />
                  </Button>
                  <Button variant="ghost" size="icon-xs" aria-label="More">
                    <MoreHorizontal />
                  </Button>
                </TableRowActions>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  },
}

// ─── Density ──────────────────────────────────────────────────────────────

export const Density: StoryObj<typeof Table> = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["compact", "default", "comfortable"] as TableDensity[]).map((density) => (
        <div key={density} className="flex flex-col gap-2">
          <div className="text-xs font-medium text-muted-foreground">{density}</div>
          <Table density={density}>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead align="end">Tokens</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.slice(0, 3).map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.agent}</TableCell>
                  <TableCell align="end">{r.tokens.toLocaleString("en-US")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  ),
}

// ─── Plain variant ────────────────────────────────────────────────────────
//
// No frame — for a table that already sits in a card or a page section.

export const Plain: StoryObj<typeof Table> = {
  render: () => (
    <div className="rounded-xl border border-border/60 bg-card p-2">
      <Table variant="plain" density="compact">
        <TableHeader>
          <TableRow>
            <TableHead>Agent</TableHead>
            <TableHead>Status</TableHead>
            <TableHead align="end">Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {runs.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.agent}</TableCell>
              <TableCell className="text-muted-foreground">{r.status}</TableCell>
              <TableCell align="end">${r.cost.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
}

// ─── Sticky header ────────────────────────────────────────────────────────

export const StickyHeader: StoryObj<typeof Table> = {
  render: () => (
    <Table stickyHeader density="compact" containerClassName="max-h-72">
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Agent</TableHead>
          <TableHead align="end">Tokens</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 30 }, (_, i) => {
          const r = runs[i % runs.length]
          return (
            <TableRow key={i}>
              <TableCell className="text-muted-foreground">{i + 1}</TableCell>
              <TableCell>{r.agent}</TableCell>
              <TableCell align="end">{(r.tokens + i * 137).toLocaleString("en-US")}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  ),
}

// ─── Empty & loading ──────────────────────────────────────────────────────

export const EmptyAndLoading: StoryObj<typeof Table> = {
  render: () => (
    <div className="flex flex-col gap-6">
      <CredentialTable rows={[]} keyLabel="Key" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Agent</TableHead>
            <TableHead>Status</TableHead>
            <TableHead align="end">Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableLoading columns={3} rows={4} />
        </TableBody>
      </Table>
    </div>
  ),
}
