import { Panel } from "@/features/portfolio/components/panel"
import { NUMBERS } from "@/features/portfolio/data/numbers"

const ID = "numbers"

export function Numbers() {
  return (
    <Panel id={ID} className="screen-line-bottom-none">
      <div className="flex items-center justify-center py-4">
        <h2 className="text-center text-sm/none font-medium tracking-wide text-muted-foreground uppercase">
          At a glance
        </h2>
      </div>

      <div className="screen-line-bottom h-px" />

      <dl className="grid gap-4 p-4">
        {NUMBERS.map((item) => (
          <Stat key={item.label} label={item.label} value={item.value} />
        ))}
      </dl>
    </Panel>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      {/* The leader is a pseudo-element because a `dl` group may only hold
          `dt` and `dd`, leaving no room for a decorative element. */}
      <dt className="flex flex-1 items-baseline gap-2 text-sm/4 after:flex-1 after:translate-y-0.75 after:border-b after:border-dashed after:border-line">
        {label}
      </dt>
      <dd className="text-sm/4 font-medium tabular-nums">{value}</dd>
    </div>
  )
}
