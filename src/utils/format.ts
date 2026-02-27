export function formatNPR(amount: number): string {
  if (!amount) return 'Price on request'
  const str = Math.round(amount).toString()
  if (str.length <= 3) return `Rs. ${str}`
  const last3 = str.slice(-3)
  const rest = str.slice(0, -3)
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')
  return `Rs. ${formatted},${last3}`
}