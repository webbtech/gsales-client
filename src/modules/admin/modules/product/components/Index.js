import React, { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import ProductForm from './Form'
import { fetchProducts, setCurrentProduct } from '../actions'
import { fmtNumberSimple } from '../../../../../utils/fmt'

const useStyles = makeStyles(theme => ({ // eslint-disable-line no-unused-vars
  root: {
    width: 900,
  },
  title: {
    flexGrow: 1,
  },
}))

const List = ({ handleClickOpen, products }) => (
  Object.values(products).map(p => (
    <div
      className="tbl-row as-link"
      key={p.id}
      onClick={() => handleClickOpen(p.id)}
      onKeyDown={handleClickOpen}
      role="button"
      tabIndex="0"
    >
      <div className="tbl-cell no-wrap">{p.name}</div>
      <div className="tbl-cell no-wrap">{p.category}</div>
      <div className="tbl-cell no-wrap">{p.type}</div>
      <div className="tbl-cell text-right">{fmtNumberSimple(p.cost)}</div>
      <div className="tbl-cell">{p.taxable ? 'T' : 'F'}</div>
      <div className="tbl-cell">{p.commissionEligible ? 'T' : 'F'}</div>
      <div className="tbl-cell">{p.oilProduct ? 'T' : 'F'}</div>
      <div className="tbl-cell no-wrap">{p.sortOrder}</div>
    </div>
  ))
)

export default function Product() {
  const classes = useStyles()
  const product = useSelector(state => state.product)
  const dispatch = useDispatch()
  const [open, setOpen] = React.useState(false)

  function handleClickOpen(id) {
    let productID = null
    if (typeof id === 'string') {
      productID = id
    }
    dispatch(setCurrentProduct(productID))
    setOpen(true)
  }

  function handleClose() {
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
        <div>Loading...</div>
      ) : (
        <div className="tbl" style={{ width: '100%' }}>
          <div className="tbl-head">
            <div className="tbl-col text-left">Name</div>
            <div className="tbl-col text-left">Category</div>
            <div className="tbl-col text-left">Type</div>
            <div className="tbl-col text-left">Cost</div>
            <div className="tbl-col text-left">Tax</div>
            <div className="tbl-col text-left">Commission</div>
            <div className="tbl-col text-left">Oil</div>
            <div className="tbl-col text-left">Sort</div>
          </div>
          <List products={product.items} handleClickOpen={handleClickOpen} />
        </div>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        // fullWidth="800"
        maxWidth="lg"
      >
        <ProductForm onCloseHandler={handleClose} />
      </Dialog>
    </div>
  )
}
