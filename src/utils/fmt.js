// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
export function fmtNumber(number, decimal = 2, useGrouping = false, currency = false) {
  if (number === undefined) return null

  const opts = {
    useGrouping,
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal,
  }
  if (currency) {
    opts.style = 'currency'
    opts.currency = 'USD'
  }
  const formatter = new Intl.NumberFormat('en-US', opts)
  return formatter.format(number)
}

export function fmtNumberSimple(number) {
  if (number === undefined) return null

  return fmtNumber(number, 2, true)
}

export function capitalize(s) {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}
