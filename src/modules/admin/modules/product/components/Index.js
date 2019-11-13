import React, { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import {
  AppBar,
  Button,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  TableBody,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import FormDialog from './FormDialog'
import Loader from '../../../../shared/Loader'
import { fetchProducts, setCurrentProduct } from '../actions'
import { fmtNumberSimple } from '../../../../../utils/fmt'

const useStyles = makeStyles(theme => ({
  root: {
    width: 900,
    marginBottom: theme.spacing(2),
  },
  table: {
    marginTop: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
}))

const List = ({ handleClickOpen, products }) => (
  Object.values(products).map(p => (
    <TableRow
      key={p.id}
      hover
      onClick={() => handleClickOpen(p.id)}
    >
      <TableCell>{p.name}</TableCell>
      <TableCell>{p.category}</TableCell>
      <TableCell>{p.type}</TableCell>
      <TableCell align="right">{fmtNumberSimple(p.cost)}</TableCell>
      <TableCell>{p.taxable ? 'T' : 'F'}</TableCell>
      <TableCell>{p.commissionEligible ? 'T' : 'F'}</TableCell>
      <TableCell>{p.oilProduct ? 'T' : 'F'}</TableCell>
      <TableCell>{p.sortOrder}</TableCell>
    </TableRow>
  ))
)

export default function Product() {
  const classes = useStyles()
  const product = useSelector(state => state.product)
  const dispatch = useDispatch()
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = (id) => {
    let productID = null
    if (typeof id === 'string') {
      productID = id
    }
    dispatch(setCurrentProduct(productID))
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const haveProducts = !product.isFetching && Object.keys(product.items).length

  return (
    <div className={classes.root}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.title}>
            Product List
          </Typography>
          <Button color="inherit" onClick={handleClickOpen}>New Product</Button>
        </Toolbar>
      </AppBar>

      {!haveProducts ? (
        <Loader />
      ) : (
        <Table size="small" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Tax</TableCell>
              <TableCell>Commission</TableCell>
              <TableCell>Oil</TableCell>
              <TableCell>Sort</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <List products={product.items} handleClickOpen={handleClickOpen} />
          </TableBody>
        </Table>
      )}

      <FormDialog
        open={open}
        onClose={handleClose}
      />
    </div>
  )
}
