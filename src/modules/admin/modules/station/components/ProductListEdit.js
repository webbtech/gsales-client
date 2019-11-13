import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { Link, withRouter } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import {
  AppBar,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@material-ui/core'

import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/ArrowBackIos'
import { makeStyles } from '@material-ui/core/styles'

import Loader from '../../../../shared/Loader'
import { fetchMonthlyStation, persistStation } from '../actions'
import { fetchProducts } from '../../product/actions'


const useStyles = makeStyles(theme => ({ // eslint-disable-line no-unused-vars
  root: {
    marginBottom: theme.spacing(2),
    width: 500,
  },
  title: {
    flexGrow: 1,
  },
}))

const List = ({ changeFunc, station, products }) => {
  if (!Object.keys(station).length || !Object.keys(products).length) {
    return null
  }

  let c = 0
  return Object.values(products).map((p) => {
    const haveProduct = Boolean(station.products.find(sp => p.id === sp.productID))
    c += 1
    return (
      <TableRow key={p.id}>
        <TableCell>{c}</TableCell>
        <TableCell>
          <FormGroup>
            <FormControlLabel
              control={(
                <Checkbox
                  color="primary"
                  checked={haveProduct}
                  onChange={e => changeFunc(p, e)}
                />
              )}
              label={p.name}
            />
          </FormGroup>
        </TableCell>
        <TableCell>{p.category}</TableCell>
      </TableRow>
    )
  })
}

function ProductListEdit({ match }) {
  const classes = useStyles()
  const station = useSelector(state => state.station)
  const product = useSelector(state => state.product)
  const dispatch = useDispatch()

  const { stationID } = match.params

  useEffect(() => {
    dispatch(fetchMonthlyStation(stationID))
    dispatch(fetchProducts())
  }, [dispatch, stationID])

  const handleProduct = (p, e) => {
    const stationData = station.item
    const stationProducts = stationData.products
    const { checked } = e.currentTarget

    if (checked) {
      stationProducts.push({ productID: p.id })
    } else {
      const idx = stationProducts.findIndex(ele => ele.productID === p.id)
      stationProducts.splice(idx, 1)
    }

    // Sort station products based on product list
    let c = 1
    const prods = []
    Object.values(product.items).forEach((prod) => {
      const sp = stationProducts.find(s => s.productID === prod.id)
      if (sp) {
        prods.push({
          _id: sp.id,
          productID: sp.productID,
          sortOrder: c,
        })
        c += 1
      }
    })

    const values = {
      products: prods,
    }
    dispatch(persistStation({ stationID: stationData.id, values }))
  }

  const stationName = !station.isFetching && station.item ? station.item.name : ''

  return (
    <div className={classes.root}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <IconButton edge="start" component={Link} to="/admin/stations" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.title}>
            {`${stationName} Products Edit`}
          </Typography>
          <Button color="inherit" component={Link} to={`/admin/stations/product-list/${station.item.id}`}>Product List</Button>
        </Toolbar>
      </AppBar>
      {station.isFetching || product.isFetching ? (
        <Loader />
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Category</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <List station={station.item} products={product.items} changeFunc={handleProduct} />
          </TableBody>
        </Table>
      )}
    </div>
  )
}
ProductListEdit.propTypes = {
  match: PropTypes.instanceOf(Object).isRequired,
}

export default withRouter(ProductListEdit)
