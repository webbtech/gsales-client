import React from 'react'
import { useSelector } from 'react-redux'

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import FormatNumber from '../../../shared/FormatNumber'
import SectionTitle from '../../../shared/SectionTitle'
import { fmtNumber } from '../../../../utils/fmt'

const R = require('ramda')

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
})

export default function List() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)

  if (!R.hasPath(['shift', 'sales', 'entities'], sales)) return null

  const fuelSales = Object.values(sales.shift.sales.entities.fuelSale)
  const { fuelDefinitions } = sales.shift.sales.entities

  return (
    <Paper className={classes.root} square>
      <SectionTitle title="Sales" />

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>Nozzle</TableCell>
            <TableCell align="center" size="small">Open $</TableCell>
            <TableCell align="center" size="small">Close $</TableCell>
            <TableCell align="center" size="small">Net $</TableCell>
            <TableCell align="center" size="small">Open L</TableCell>
            <TableCell align="center" size="small">Close L</TableCell>
            <TableCell align="center" size="small">Net L</TableCell>
            <TableCell align="center" size="small">Theoretical</TableCell>
            <TableCell align="center" size="small">Difference</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {fuelSales.map(fs => (
            <TableRow key={fs.id} hover>
              <TableCell>{fs.dispenserID.number}</TableCell>
              <TableCell>{fuelDefinitions[fs.dispenserID.gradeID].label}</TableCell>
              <TableCell align="right">{fmtNumber(fs.dollars.open)}</TableCell>
              <TableCell align="right">{fmtNumber(fs.dollars.close)}</TableCell>
              <TableCell align="right">{fmtNumber(fs.dollars.net)}</TableCell>
              <TableCell align="right">{fmtNumber(fs.litres.open, 3)}</TableCell>
              <TableCell align="right">{fmtNumber(fs.litres.close, 3)}</TableCell>
              <TableCell align="right">{fmtNumber(fs.litres.net, 3)}</TableCell>
              <TableCell align="right">{fmtNumber(fs.dollars.theoretical)}</TableCell>
              <TableCell align="right">
                <FormatNumber value={fs.dollars.diff} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}
