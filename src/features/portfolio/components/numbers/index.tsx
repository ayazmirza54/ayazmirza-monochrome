import { AsciiMark3D } from "@/features/portfolio/components/ascii/ascii-mark-3d"
import { Panel } from "@/features/portfolio/components/panel"
import { NUMBERS } from "@/features/portfolio/data/numbers"

import { CountUp } from "./count-up"

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

      <div className="grid sm:grid-cols-[1fr_auto]">
        <dl className="grid content-center gap-4 p-4">
          {NUMBERS.map((item) => (
            <Stat key={item.label} label={item.label} value={item.value} />
          ))}
        </dl>

        {/* 56ch of 10px mono needs the sm column; it is decoration, so
            smaller screens simply go without. */}
        <div className="flex items-center justify-center border-l border-dashed border-line px-4 py-3 max-sm:hidden">
          <AsciiMark3D className="text-foreground/70" />
        </div>
      </div>
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
      <dd className="text-sm/4 font-medium tabular-nums">
        <CountUp value={value} />
      </dd>
    </div>
  )
}
