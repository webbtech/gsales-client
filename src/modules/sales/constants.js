import { getEnv } from '../../utils/utils'

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

// Maximum discrepancy amount in fuel sales
export const DISCREPANCY_LIMIT = 10


// ===================== Download Service constants ============================================ //

// export const DWNLD_PDF_SERVICE_URL = 'https://pdf-reports.gsales.pfapi.io/report'
export const DWNLD_PDF_DAY = 'day'
export const DWNLD_PDF_SHIFT = 'shift'


export const getPdfServiceUrl = () => {
  const env = getEnv()
  let url = ''

  switch (env) {
    case 'development':
    case 'stage':
      url = 'https://pdf-reports-stage.gsales.pfapi.io/report'
      break
    case 'production':
      url = 'https://pdf-reports-prod.gsales.pfapi.io/report'
      break
    default:
      break
  }

  return url
}
