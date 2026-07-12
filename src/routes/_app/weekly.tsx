import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Download, Share2 } from 'lucide-react'

import { ScreenHeader } from '../../components/screen-header'
import { buildWeeklyGraphicSVG, downloadPNG, downloadSVG } from '../../lib/graphic'
import { formatRand } from '../../lib/deals'
import { useWeeklyIndex, weekRangeLabel } from '../../lib/weekly'

export const Route = createFileRoute('/_app/weekly')({ component: WeeklyScreen })

const SHORT_NAMES: Record<string, string> = { Woolworths: 'Woolies', 'Pick n Pay': 'PnP' }

function WeeklyScreen() {
  const { data: index, isPending, error } = useWeeklyIndex()
  const [exportError, setExportError] = useState<string | null>(null)
  const dateRange = weekRangeLabel()

  async function exportGraphic(kind: 'png' | 'svg') {
    if (!index) return
    setExportError(null)
    const svg = buildWeeklyGraphicSVG(index, dateRange)
    const base = `skarrel-cheapest-basket-${dateRange.replace(/[^\w]+/g, '-').toLowerCase()}`
    try {
      if (kind === 'png') await downloadPNG(svg, `${base}.png`)
      else downloadSVG(svg, `${base}.svg`)
    } catch {
      setExportError("PNG export didn't work in this browser — try the SVG instead.")
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <ScreenHeader
        title="Cheapest Basket This Week"
        subtitle={`Standard staples basket · ${dateRange} · Westville, Pinetown & Upper Highway`}
      />

      <div className="flex-1 px-4 pt-4 pb-6">
        {isPending && (
          <p className="pt-10 text-center text-xs text-muted-foreground">
            Totting up this week's basket…
          </p>
        )}

        {error && (
          <p className="pt-10 text-center text-xs text-destructive">
            Couldn't load the weekly basket — if this persists, the basket-index
            migration may not be applied yet.
          </p>
        )}

        {index && !index.hasData && (
          <div className="rounded-2xl border border-dashed border-border p-5 text-center">
            <p className="text-sm font-semibold text-foreground">No index prices yet this week</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              The weekly basket tracks a fixed list of staples across all five
              stores. As specials for those items are posted, the table fills in.
            </p>
          </div>
        )}

        {index && index.hasData && (
          <>
            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
              <table className="w-full min-w-[520px] text-left text-xs">
                <thead>
                  <tr className="bg-brand text-white">
                    <th className="sticky left-0 bg-brand px-3 py-2.5 font-bold">ITEM</th>
                    {index.retailers.map((retailer) => (
                      <th key={retailer.id} className="px-2 py-2.5 text-center font-bold">
                        {SHORT_NAMES[retailer.name] ?? retailer.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {index.rows.map((row, rowIdx) => (
                    <tr key={row.product.product_id} className={rowIdx % 2 === 1 ? 'bg-muted/50' : ''}>
                      <td className="sticky left-0 bg-inherit px-3 py-2.5 font-semibold text-card-foreground">
                        {row.product.name}
                      </td>
                      {row.prices.map((price, i) => (
                        <td key={i} className="px-2 py-2.5 text-center">
                          {price === null ? (
                            <span className="text-muted-foreground/40">—</span>
                          ) : i === row.cheapestIdx ? (
                            <span className="rounded-full bg-coral-soft px-2 py-0.5 font-extrabold text-coral">
                              {formatRand(price)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">{formatRand(price)}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-brand-dark text-white">
                    <td className="sticky left-0 bg-brand-dark px-3 py-3 font-extrabold">TOTAL</td>
                    {index.totals.map((total, i) => (
                      <td key={i} className="px-2 py-3 text-center font-bold">
                        {total.pricedCount === 0 ? (
                          <span className="opacity-40">—</span>
                        ) : total.cheapest ? (
                          <span className="rounded-full bg-coral px-2 py-1 font-extrabold">
                            {formatRand(total.total)}
                          </span>
                        ) : (
                          <span className="opacity-70">{formatRand(total.total)}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-3 px-1 text-[10px] leading-relaxed text-muted-foreground">
              Cheapest price per item in coral. The winning total is the lowest
              among stores pricing the most items. "—" means no live special.
            </p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => exportGraphic('png')}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand py-3 text-xs font-bold text-white"
              >
                <Share2 size={14} />
                Download shareable graphic
              </button>
              <button
                onClick={() => exportGraphic('svg')}
                aria-label="Download as SVG"
                className="flex items-center justify-center rounded-2xl border border-border bg-card px-4 text-muted-foreground"
              >
                <Download size={15} />
              </button>
            </div>
            {exportError && (
              <p className="mt-2 text-center text-[10px] text-destructive">{exportError}</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
