import React from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import SectionTitle from '../../../shared/SectionTitle'
import { setFuelCosts } from '../../utils'
import { patchShift } from '../../actions'

const R = require('ramda')

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  table: {
    minWidth: 200,
  },
})

function CostCell({ fuelCost, shift }) {
  const editableTypes = [1, 4, 6]
  const dispatch = useDispatch()

  function handleChange(e) {
    const { value } = e.target

    const params = {
      action: 'patchShift',
      shiftID: shift.id,
      stationID: shift.stationID,
      recordNum: shift.recordNum,
      actionArgs: {
        field: `fuelCosts.fuel_${fuelCost.id}`,
        value,
        method: 'updateFuelCost',
      },
    }
    dispatch(patchShift(params))
  }

  if (!editableTypes.includes(fuelCost.id)) {
    return <TableCell>{fuelCost.cost}</TableCell>
  }
  return (
    <TableCell>
      <TextField
        id="cost"
        defaultValue={fuelCost.cost}
        onBlur={handleChange}
        margin="dense"
      />
    </TableCell>
  )
}
CostCell.propTypes = {
  fuelCost: PropTypes.instanceOf(Object).isRequired,
  shift: PropTypes.instanceOf(Object).isRequired,
}

export default function FuelSummary() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)

  let shiftData
  if (R.hasPath(['shift', 'sales', 'result', 'shift'], sales)) {
    shiftData = sales.shift.sales.result.shift
  }
  if (!shiftData) return null

  const { fuelDefinitions } = sales.shift.sales.entities

  const fuelCosts = setFuelCosts(fuelDefinitions, shiftData.fuelCosts)
  // console.log('fuelCosts in FuelSummary:', fuelCosts)

  return (
    <Paper className={classes.root} square>
      <SectionTitle title="Fuel Costs" />

      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>Grade</TableCell>
            <TableCell>Cost</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fuelCosts.map(fc => (
            <TableRow key={fc.id}>
              <TableCell>{fc.id}</TableCell>
              <TableCell>{fc.label}</TableCell>
              <CostCell fuelCost={fc} shift={shiftData} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}
