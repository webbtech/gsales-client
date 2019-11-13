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

import SectionTitle from '../../../shared/SectionTitle'

const R = require('ramda')

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
})

export default function Adjustments() {
  const classes = useStyles()
  const journal = useSelector(state => state.journal)

  if (!R.hasPath(['response', 'entities'], journal)) return null

  let jRecords = []
  const { records } = journal.response.entities
  if (records) {
    const recordVals = Object.values(records)
    jRecords = recordVals.filter(jr => (jr.type === 'nonFuelSaleAdjust' && jr.values.close))
  }

  return (
    <Paper className={classes.root} square>
      <SectionTitle title="Adjustments" />

      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell size="small">Product</TableCell>
            <TableCell align="center" size="small">Type</TableCell>
            <TableCell align="center" size="small">Value</TableCell>
            <TableCell align="center" size="small">Prev Sold</TableCell>
            <TableCell align="center" size="small">Prev Close</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {jRecords.map(jr => (
            <TableRow key={jr.id} hover>
              <TableCell size="small">{jr.values.adjustAttend.productName}</TableCell>
              <TableCell align="center" size="small">{jr.values.type}</TableCell>
              <TableCell align="center" size="small">{jr.values.adjust}</TableCell>
              <TableCell align="center" size="small">{jr.values.type === 'sales' ? (jr.values.sold - jr.values.adjust) : ('')}</TableCell>
              <TableCell align="center" size="small">{(jr.values.close - jr.values.adjust)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}
