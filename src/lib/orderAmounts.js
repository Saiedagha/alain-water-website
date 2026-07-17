export function calculatePayNowAmount(total, paymentMethod = 'deposit', depositAmount = 1) {
  const orderTotal = Math.max(Number(total) || 0, 0)
  return orderTotal
}
