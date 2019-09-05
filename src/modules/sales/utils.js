export function setFuelCosts(fuelDefs, fCosts) {
  const ret = []
  Object.values(fuelDefs).forEach((fd) => {
    const fuelCost = fCosts[`fuel${fd.id}`]
    if (fuelCost) {
      ret.push(Object.assign({}, { ...fd, cost: fuelCost }))
    }
  })
  return ret
}

export function setFuelSummaries(fuelCosts, fuelSummary) {
  return fuelCosts.map((fc) => {
    const fs = fuelSummary[`fuel${fc.id}`]
    return Object.assign({}, { ...fc, ...fs })
  })
}

export function setFuelSummaryTotals(fuelSummaries) {
  const vals = {
    dollar: 0.0,
    litre: 0.0,
  }
  fuelSummaries.forEach((fs) => {
    vals.litre += fs.litre
    vals.dollar += fs.dollar
  })
  return vals
}
