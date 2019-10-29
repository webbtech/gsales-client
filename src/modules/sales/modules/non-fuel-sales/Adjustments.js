import React from 'react'
import { useSelector } from 'react-redux'

import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableHead from '@material-ui/core/TableHead'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const R = require('ramda')

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
}))

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
      <Typography variant="h6" className={classes.title}>
        Adjustments
      </Typography>
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
