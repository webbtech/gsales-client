/* eslint-disable import/prefer-default-export */
import { createSelector } from 'reselect'

import { cashAndCardFields } from './constants'

const R = require('ramda')

const shift = state => state.sales.shift.sales.result.shift

function extractMisc(misc) {
  const calculations = R.hasPath(['meta', 'calculations'], misc) ? misc.meta.calculations : null
  const ret = {}
  Object.keys(misc).forEach((key) => {
    switch (key) {
      case 'otherNonFuel':
        ret['otherNonFuel.giftCerts'] = {
          value: misc.otherNonFuel.giftCerts || null,
          calc: calculations && calculations['otherNonFuel:giftCerts'] ? calculations['otherNonFuel:giftCerts'] : null,
        }
        ret['otherNonFuel.bobs'] = {
          value: misc.otherNonFuel.bobs || null,
          calc: calculations && calculations['otherNonFuel:bobs'] ? calculations['otherNonFuel:bobs'] : null,
        }
        break

      case 'otherNonFuelBobs':
        ret['otherNonFuelBobs.bobsGiftCerts'] = {
          value: misc.otherNonFuelBobs.bobsGiftCerts || null,
          calc: calculations && calculations['otherNonFuelBobs:bobsGiftCerts'] ? calculations['otherNonFuelBobs:bobsGiftCerts'] : null,
        }
        break

      case 'salesSummary':
        ret['salesSummary.fuelAdjust'] = {
          value: misc.salesSummary.fuelAdjust || null,
          calc: calculations && calculations['salesSummary:fuelAdjust'] ? calculations['salesSummary:fuelAdjust'] : null,
        }
        break

      default:
        break
    }
  })
  return ret
}

export const selectNonFuelMisc = createSelector(
  shift,
  misc => extractMisc(misc)
)

function extractCashCards(cashCards) {
  const calculations = R.hasPath(['meta', 'calculations'], cashCards) ? cashCards.meta.calculations : {}
  const ret = {}

  cashAndCardFields().forEach((f) => {
    const pcs = f.split('.')
    ret[f] = {
      value: cashCards[pcs[0]][pcs[1]],
      calc: calculations[`${pcs[0]}:${pcs[1]}`] || null,
    }
  })
  return ret
}

export const selectCashAndCards = createSelector(
  shift,
  cashCards => extractCashCards(cashCards)
)
