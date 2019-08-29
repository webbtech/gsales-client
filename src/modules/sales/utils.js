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
