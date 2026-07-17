export function calculatePayNowAmount(total, paymentMethod = 'deposit', depositAmount = 5) {
  const orderTotal = Math.max(Number(total) || 0, 0)
  if (paymentMethod === 'deposit') {
    const deposit = Math.max(Number(depositAmount) || 0, 0)
    return Math.min(orderTotal, deposit)
  }
  return orderTotal
}
