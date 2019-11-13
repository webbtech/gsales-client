/* eslint-disable import/prefer-default-export */
import { START_YEAR } from './constants'
import { cashAndCards } from '../sales/constants'

export const setYears = () => {
  const dte = new Date()
  const curYear = dte.getFullYear()
  const range = (l, r) => new Array(r + 1 - l).fill().map((_, k) => k + l)
  return range(START_YEAR, curYear)
}

export const cashFieldMap = {
  cashBills: 'cash.bills',
  cashDebit: 'cash.debit',
  cashDieselDiscount: 'cash.dieselDiscount',
  cashDriveOffNSF: 'cash.driveOffNSF',
  cashGalesLoyaltyRedeem: 'cash.galesLoyaltyRedeem',
  cashGiftCertRedeem: 'cash.giftCertRedeem',
  cashLotteryPayout: 'cash.lotteryPayout',
  cashOsAdjusted: 'cash.osAdjusted',
  cashOther: 'cash.other',
  cashPayout: 'cash.payout',
  cashWriteOff: 'cash.writeOff',
  creditCardAmex: 'creditCard.amex',
  creditCardDiscover: 'creditCard.discover',
  creditCardGales: 'creditCard.gales',
  creditCardMc: 'creditCard.mc',
  creditCardVisa: 'creditCard.visa',
}

export const getCashFieldLabel = key => cashAndCards[cashFieldMap[key]]
