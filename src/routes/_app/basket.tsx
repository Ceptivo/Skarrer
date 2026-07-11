import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Check, Minus, PiggyBank, Plus, ShoppingBasket, X } from 'lucide-react'

import { ScreenHeader } from '../../components/screen-header'
import {
  useAddBasketItem,
  useBasketItems,
  useDefaultBasket,
  useProductSuggestions,
  useSetItemQuantity,
  useStoreComparison,
} from '../../lib/basket'
import { savingsFromComparison } from '../../lib/comparison'
import { formatRand } from '../../lib/deals'
import { useLogSavings } from '../../lib/savings'

export const Route = createFileRoute('/_app/basket')({ component: BasketScreen })

function BasketScreen() {
  const { data: basket } = useDefaultBasket()
  const { data: items, isPending: itemsPending } = useBasketItems(basket?.id)
  const setQuantity = useSetItemQuantity(basket?.id)
  const { data: comparison, isPending: comparisonPending } = useStoreComparison(items)

  const itemCount = items?.reduce((n, item) => n + item.quantity, 0) ?? 0
  const hasItems = (items?.length ?? 0) > 0

  return (
    <div className="flex min-h-full flex-col">
      <ScreenHeader
        title="My Basket"
        subtitle={
          hasItems
            ? `${itemCount} item${itemCount === 1 ? '' : 's'} · compared against this week's prices`
            : 'Compare your regular shop across stores'
        }
      />

      <div className="flex-1 px-4 pt-4 pb-6">
        {!hasItems && !itemsPending && (
          <div className="mb-4 rounded-2xl border border-border bg-card p-5 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-brand-soft">
              <ShoppingBasket size={22} className="text-brand" />
            </div>
            <p className="text-sm font-semibold text-foreground">Create your basket</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Add the items you buy every week — Skarrel checks this week's specials
              at every store and shows you which one wins for your whole basket.
            </p>
          </div>
        )}

        {hasItems && (
          <div className="divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
            {items!.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-2 px-4 py-3">
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-card-foreground">
                  {item.product_name}
                </span>
                <div className="flex flex-shrink-0 items-center gap-1.5">
                  <button
                    aria-label="Decrease quantity"
                    onClick={() =>
                      setQuantity.mutate({ itemId: item.id, quantity: item.quantity - 1 })
                    }
                    className="flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-foreground">
                    {item.quantity}
                  </span>
                  <button
                    aria-label="Increase quantity"
                    onClick={() =>
                      setQuantity.mutate({ itemId: item.id, quantity: item.quantity + 1 })
                    }
                    className="flex size-6 items-center justify-center rounded-full bg-brand-soft text-brand"
                  >
                    <Plus size={12} />
                  </button>
                  <button
                    aria-label="Remove item"
                    onClick={() => setQuantity.mutate({ itemId: item.id, quantity: 0 })}
                    className="ml-1.5 text-muted-foreground/60"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <AddItemInput basketId={basket?.id} />

        {hasItems && (
          <>
            <p className="mt-6 mb-2 px-1 text-[11px] font-semibold text-muted-foreground">
              CHEAPEST STORE FOR THIS BASKET
            </p>

            {comparisonPending && (
              <p className="pt-2 text-center text-xs text-muted-foreground">
                Checking this week's prices…
              </p>
            )}

            {comparison && comparison.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-4 text-center">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  No current specials match your basket yet. As deals land each week,
                  your comparison lights up here.
                </p>
              </div>
            )}

            <div className="space-y-2">
              {comparison?.map((store) => (
                <div
                  key={store.retailer_id}
                  className={
                    store.cheapest
                      ? 'flex items-center justify-between rounded-2xl border-[1.5px] border-brand bg-card p-3.5 shadow-sm'
                      : 'flex items-center justify-between rounded-2xl border border-border bg-card p-3.5 shadow-sm'
                  }
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={
                        store.cheapest
                          ? 'flex size-[38px] items-center justify-center rounded-xl bg-brand'
                          : 'flex size-[38px] items-center justify-center rounded-xl bg-muted'
                      }
                    >
                      {store.cheapest ? (
                        <Check size={17} className="text-white" />
                      ) : (
                        <ShoppingBasket size={15} className="text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-card-foreground">
                        {store.retailer_name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {store.priced_items} of {items!.length} item
                        {items!.length === 1 ? '' : 's'} priced
                      </p>
                    </div>
                  </div>
                  <p
                    className={
                      store.cheapest
                        ? 'text-[15px] font-extrabold text-brand'
                        : 'text-[15px] font-extrabold text-foreground'
                    }
                  >
                    {formatRand(store.total)}
                  </p>
                </div>
              ))}
            </div>

            {comparison && comparison.length > 0 && (
              <p className="mt-3 px-1 text-[10px] leading-relaxed text-muted-foreground">
                Totals cover the items each store currently has a special for — stores
                pricing more of your basket rank first.
              </p>
            )}

            {comparison && <LockInSavings comparison={comparison} basketId={basket?.id} />}
          </>
        )}
      </div>
    </div>
  )
}

// The savings tracker's entry point: shopping the winning store logs a
// savings event (vs. the average across comparable stores — Master Doc §7).
function LockInSavings({
  comparison,
  basketId,
}: {
  comparison: NonNullable<ReturnType<typeof useStoreComparison>['data']>
  basketId?: string
}) {
  const logSavings = useLogSavings(basketId)
  const saving = savingsFromComparison(comparison)

  if (!saving) return null

  if (logSavings.isSuccess) {
    return (
      <div className="mt-4 rounded-2xl bg-brand-soft p-4 text-center">
        <p className="text-sm font-bold text-brand-dark">
          Nice one — {formatRand(saving.amount_saved)} skarrel'd.
        </p>
        <Link
          to="/savings"
          className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand"
        >
          <PiggyBank size={13} />
          See your savings
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-4 rounded-2xl border border-border bg-card p-4">
      <p className="text-xs leading-relaxed text-muted-foreground">
        Shopping this basket at <strong>{saving.cheapest_retailer_name}</strong> beats
        the average across {saving.stores_compared} stores by{' '}
        <strong className="text-brand">{formatRand(saving.amount_saved)}</strong>.
      </p>
      <button
        onClick={() => logSavings.mutate(saving)}
        disabled={logSavings.isPending}
        className="mt-3 w-full rounded-2xl bg-coral py-2.5 text-xs font-bold text-white disabled:opacity-60"
      >
        {logSavings.isPending ? 'Locking in…' : "Shopped it? Lock in your saving"}
      </button>
      {logSavings.isError && (
        <p className="mt-2 text-center text-[10px] text-destructive">
          Couldn't save that — try again.
        </p>
      )}
    </div>
  )
}

function AddItemInput({ basketId }: { basketId?: string }) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const addItem = useAddBasketItem(basketId)
  const { data: suggestions } = useProductSuggestions(value)

  function add(name: string, productId?: string) {
    if (!name.trim()) return
    addItem.mutate({ product_name: name, product_id: productId ?? null })
    setValue('')
  }

  const showSuggestions = focused && value.trim().length >= 2 && (suggestions?.length ?? 0) > 0

  return (
    <div className="relative mt-3">
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-1.5">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={(e) => e.key === 'Enter' && add(value)}
          placeholder='Add an item, e.g. "Full Cream Milk 1L"'
          className="w-full bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground/70"
        />
        <button
          aria-label="Add item"
          onClick={() => add(value)}
          disabled={!value.trim() || addItem.isPending}
          className="flex size-7 flex-shrink-0 items-center justify-center rounded-full bg-brand text-white disabled:opacity-40"
        >
          <Plus size={15} />
        </button>
      </div>

      {showSuggestions && (
        <div className="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          {suggestions!.map((product) => (
            <button
              key={product.id}
              onMouseDown={(e) => {
                e.preventDefault()
                add(product.name, product.id)
              }}
              className="block w-full px-4 py-2.5 text-left text-sm text-card-foreground hover:bg-muted"
            >
              {product.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
