// Weekly shareable graphic (1080×1270), faithful to the locked design in
// docs/skarrel-weekly-basket-graphic-final.svg: teal gradient, logo + date
// pill, zebra table with coral chips on the cheapest price per item, basket
// total band, trust line, footer. Generated client-side from live index data.

import type { WeeklyIndex } from './weekly'

const SHORT_NAMES: Record<string, string> = { Woolworths: 'Woolies' }

function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function rand(value: number): string {
  return `R${value.toFixed(2)}`
}

export function buildWeeklyGraphicSVG(
  index: WeeklyIndex,
  dateRange: string,
  trustLine = 'Prices from this week’s catalogues · E&OE',
): string {
  const retailers = index.retailers
  const colWidth = retailers.length > 0 ? 660 / retailers.length : 660
  const colX = (i: number) => 360 + colWidth * i + colWidth / 2

  const tableTop = 300
  const headerH = 100
  const rowH = 72
  const totalH = 90
  const rowsH = index.rows.length * rowH
  const cardH = headerH + rowsH + totalH
  const tableBottom = tableTop + cardH
  const trustY = tableBottom + 45
  const dividerY = trustY + 45
  const footerY1 = dividerY + 50
  const footerY2 = footerY1 + 34
  const height = footerY2 + 60

  const parts: string[] = []

  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 ${height}" font-family="'Century Gothic','Poppins','Segoe UI',sans-serif">`,
    `<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">`,
    `<stop offset="0%" stop-color="#0f766e"/><stop offset="100%" stop-color="#0b5a54"/>`,
    `</linearGradient></defs>`,
    `<rect width="1080" height="${height}" fill="url(#bg)"/>`,
    // Header: logo mark, wordmark, date pill
    `<rect x="60" y="56" width="72" height="72" rx="20" fill="#ffffff"/>`,
    `<text x="96" y="108" font-size="38" font-weight="800" text-anchor="middle" letter-spacing="-2"><tspan fill="#0f766e">s</tspan><tspan fill="#ff7a59">k</tspan></text>`,
    `<text x="144" y="98" font-size="28" font-weight="800" fill="#ffffff" letter-spacing="-1">Ska<tspan fill="#ff7a59">rr</tspan>el</text>`,
    `<rect x="856" y="66" width="164" height="40" rx="20" fill="rgba(255,255,255,0.15)"/>`,
    `<text x="938" y="92" font-size="16" font-weight="700" fill="#ffffff" text-anchor="middle">${esc(dateRange)}</text>`,
    // Headline
    `<text x="60" y="190" font-size="22" font-weight="700" fill="#ffd7c9" letter-spacing="2">CHEAPEST BASKET THIS WEEK</text>`,
    `<text x="60" y="238" font-size="42" font-weight="800" fill="#ffffff" letter-spacing="-1">Westville &amp; Pinetown</text>`,
    // Table card + header band
    `<rect x="60" y="${tableTop}" width="960" height="${cardH}" rx="26" fill="#ffffff"/>`,
    `<rect x="60" y="${tableTop}" width="960" height="${headerH}" rx="26" fill="#0f766e"/>`,
    `<rect x="60" y="${tableTop + headerH - 26}" width="960" height="26" fill="#0f766e"/>`,
    `<text x="88" y="${tableTop + headerH / 2 + 6}" font-size="17" font-weight="800" fill="#ffffff">ITEM</text>`,
  )

  retailers.forEach((retailer, i) => {
    const label = SHORT_NAMES[retailer.name] ?? retailer.name
    parts.push(
      `<text x="${colX(i)}" y="${tableTop + headerH / 2 + 6}" font-size="15" font-weight="800" fill="#ffffff" text-anchor="middle">${esc(label)}</text>`,
    )
  })

  index.rows.forEach((row, rowIdx) => {
    const rowTop = tableTop + headerH + rowIdx * rowH
    const textY = rowTop + rowH / 2 + 6
    if (rowIdx % 2 === 1) {
      parts.push(`<rect x="60" y="${rowTop}" width="960" height="${rowH}" fill="#f9f9f7"/>`)
    }
    if (rowIdx > 0) {
      parts.push(`<line x1="88" y1="${rowTop}" x2="992" y2="${rowTop}" stroke="#f0f0ee" stroke-width="1.5"/>`)
    }
    parts.push(
      `<text x="88" y="${textY}" font-size="18" font-weight="700" fill="#111827">${esc(row.product.name)}</text>`,
    )
    row.prices.forEach((price, i) => {
      const x = colX(i)
      if (price === null) {
        parts.push(
          `<text x="${x}" y="${textY}" font-size="16" font-weight="600" fill="#d1d5db" text-anchor="middle">—</text>`,
        )
      } else if (i === row.cheapestIdx) {
        parts.push(
          `<rect x="${x - 46}" y="${rowTop + rowH / 2 - 19}" width="92" height="38" rx="19" fill="#fff0eb"/>`,
          `<text x="${x}" y="${textY}" font-size="18" font-weight="800" fill="#ff7a59" text-anchor="middle">${rand(price)}</text>`,
        )
      } else {
        parts.push(
          `<text x="${x}" y="${textY}" font-size="16" font-weight="600" fill="#9ca3af" text-anchor="middle">${rand(price)}</text>`,
        )
      }
    })
  })

  // Basket total band
  const totalTop = tableTop + headerH + rowsH
  const totalTextY = totalTop + totalH / 2 + 7
  parts.push(
    `<rect x="60" y="${totalTop}" width="960" height="${totalH}" fill="#0b5a54"/>`,
    `<rect x="60" y="${totalTop + totalH - 26}" width="960" height="26" rx="26" fill="#0b5a54"/>`,
    `<text x="88" y="${totalTextY}" font-size="21" font-weight="800" fill="#ffffff">BASKET TOTAL</text>`,
  )
  index.totals.forEach((total, i) => {
    const x = colX(i)
    if (total.pricedCount === 0) {
      parts.push(
        `<text x="${x}" y="${totalTextY}" font-size="18" font-weight="700" fill="rgba(255,255,255,0.35)" text-anchor="middle">—</text>`,
      )
    } else if (total.cheapest) {
      parts.push(
        `<rect x="${x - 59}" y="${totalTop + totalH / 2 - 22}" width="118" height="44" rx="22" fill="#ff7a59"/>`,
        `<text x="${x}" y="${totalTextY}" font-size="21" font-weight="800" fill="#ffffff" text-anchor="middle">${rand(total.total)}</text>`,
      )
    } else {
      // Flag totals missing items so a lower partial number can't be
      // mistaken for the winner.
      const partial = total.pricedCount < index.rows.length
      parts.push(
        `<text x="${x}" y="${totalTextY - (partial ? 7 : 0)}" font-size="18" font-weight="700" fill="rgba(255,255,255,0.55)" text-anchor="middle">${rand(total.total)}</text>`,
      )
      if (partial) {
        parts.push(
          `<text x="${x}" y="${totalTextY + 16}" font-size="11" font-weight="600" fill="rgba(255,255,255,0.4)" text-anchor="middle">${total.pricedCount} of ${index.rows.length} items</text>`,
        )
      }
    }
  })

  parts.push(
    `<circle cx="68" cy="${trustY - 5}" r="7" fill="#4ade80"/>`,
    `<text x="86" y="${trustY}" font-size="16" font-weight="600" fill="rgba(255,255,255,0.85)">${esc(trustLine)}</text>`,
    `<line x1="60" y1="${dividerY}" x2="1020" y2="${dividerY}" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>`,
    `<text x="60" y="${footerY1}" font-size="28" font-weight="800" fill="#ffffff">Ska<tspan fill="#ff7a59">rr</tspan>el smart. Save more.</text>`,
    `<text x="60" y="${footerY2}" font-size="18" fill="rgba(255,255,255,0.6)">skarrel.com</text>`,
    `</svg>`,
  )

  return parts.join('\n')
}

export function downloadSVG(svg: string, filename: string) {
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  triggerDownload(URL.createObjectURL(blob), filename)
}

export async function downloadPNG(svg: string, filename: string, width = 1080) {
  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)
  try {
    const img = new Image()
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('Could not render the graphic'))
      img.src = url
    })
    const scale = width / img.width
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = Math.round(img.height * scale)
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    const pngBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png'),
    )
    if (!pngBlob) throw new Error('PNG export failed')
    triggerDownload(URL.createObjectURL(pngBlob), filename)
  } finally {
    URL.revokeObjectURL(url)
  }
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}
