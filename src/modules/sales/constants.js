/* export const cashAndCardsFields = [
  'creditCard.visa',
  'creditCard.mc',
  'creditCard.gales',
  'creditCard.amex',
  'creditCard.discover',
  'cash.debit',
  'cash.dieselDiscount',
  'cash.lotteryPayout',
  'cash.payout',
  'cash.bills',
  'cash.galesLoyaltyRedeem',
  'cash.giftCertRedeem',
  'cash.osAdjusted',
  'cash.driveOffNSF',
  'cash.writeOff',
  'cash.other',
] */

export const cashAndCards = {
  'creditCard.visa': 'VISA',
  'creditCard.mc': 'Mastercard',
  'creditCard.gales': 'Gales Card',
  'creditCard.amex': 'AMEX',
  'creditCard.discover': 'Discover',
  'cash.debit': 'Debit',
  'cash.dieselDiscount': 'Diesel Discount',
  'cash.lotteryPayout': 'Lottery Payout',
  'cash.payout': 'Supplier Payout',
  'cash.bills': 'Cash',
  'cash.galesLoyaltyRedeem': 'Gales Loyalty Redeemed',
  'cash.giftCertRedeem': 'Gift Certificate Redeemed',
  'cash.osAdjusted': 'OS Adjust',
  'cash.driveOffNSF': 'Drive offs / NSF',
  'cash.writeOff': 'Write offs',
  'cash.other': 'Other',
}

export const cashAndCardFields = () => Object.keys(cashAndCards)
export const splitField = 'cash.dieselDiscount'

export const splitFields = () => {
  const fields = cashAndCardFields()
  const ret = []
  const vals = {
    first: fields.slice(0, 7),
    second: fields.slice(7),
  }
  ret[0] = vals.first.map(f => ({ field: f, label: cashAndCards[f] }))
  ret[1] = vals.second.map(f => ({ field: f, label: cashAndCards[f] }))
  return ret
}
