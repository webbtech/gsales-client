import React from 'react'
import { useSelector } from 'react-redux'

import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import UpdateIcon from '@material-ui/icons/Update'
import { makeStyles } from '@material-ui/core/styles'

import { fmtNumber } from '../../../../utils/fmt'

const R = require('ramda')

const useStyles = makeStyles(theme => ({ // eslint-disable-line no-unused-vars
  root: {
    width: '100%',
  },
  title: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
}))

export default function ProductList() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)

  if (!R.hasPath(['shift', 'sales', 'entities'], sales)) return null
  // console.log('entities:', sales.shift.sales.entities.nonFuelSale)

  const nonFuelSales = Object.values(sales.shift.sales.entities.nonFuelSale)
  // console.log('nonFuelSales:', nonFuelSales)

  return (
    <Paper className={classes.root} square>
      <Typography variant="h6" className={classes.title}>
        Products
      </Typography>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell size="small">Product</TableCell>
            <TableCell align="center" size="small">Open</TableCell>
            <TableCell align="center" size="small">Restock</TableCell>
            <TableCell align="center" size="small">Sold</TableCell>
            <TableCell align="center" size="small">Close</TableCell>
            <TableCell align="center" size="small">Sales</TableCell>
            <TableCell align="center" size="small" />
          </TableRow>
        </TableHead>
        <TableBody>
          {nonFuelSales.map(nfs => (
            <TableRow key={nfs.id}>
              <TableCell size="small">{nfs.productID.name}</TableCell>
              <TableCell align="center" size="small">{nfs.qty.open}</TableCell>
              <TableCell align="center" size="small">{nfs.qty.restock}</TableCell>
              <TableCell align="center" size="small">{nfs.qty.sold}</TableCell>
              <TableCell align="center" size="small">{nfs.qty.close}</TableCell>
              <TableCell align="right" size="small">{fmtNumber(nfs.sales)}</TableCell>
              <TableCell align="center" size="small"><UpdateIcon /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}
