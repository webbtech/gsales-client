import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { Link, withRouter } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/ArrowBackIos'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { fetchStation, persistStation } from '../actions'
import { fetchProducts } from '../../product/actions'


const useStyles = makeStyles(theme => ({ // eslint-disable-line no-unused-vars
  root: {
    width: 500,
  },
  title: {
    flexGrow: 1,
  },
}))

const List = ({ changeFunc, station, products }) => {
  if (!Object.keys(station).length || !Object.keys(products).length) {
    return <div>Loading..</div>
  }

  let c = 0
  return Object.values(products).map((p) => {
    const haveProduct = Boolean(station.products.find(sp => p.id === sp.productID))
    c += 1
    return (
      <div key={p.id} className="tbl-row">
        <div className="tbl-cell no-wrap">{c}</div>
        <div className="tbl-cell no-wrap">
          <FormGroup>
            <FormControlLabel
              control={(
                <Checkbox
                  color="primary"
                  checked={haveProduct}
                  onChange={e => changeFunc(p, e)}
                  // value="gilad"
                />
              )}
              label={p.name}
            />
          </FormGroup>
        </div>
        <div className="tbl-cell no-wrap">{p.category}</div>
      </div>
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
    dispatch(fetchStation(stationID))
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
        <div>Loading...</div>
      ) : (
        <div className="tbl" style={{ width: '100%' }}>
          <div className="tbl-head">
            <div className="tbl-col text-left">#</div>
            <div className="tbl-col text-left">Product</div>
            <div className="tbl-col text-left">Category</div>
          </div>
          <List station={station.item} products={product.items} changeFunc={handleProduct} />
        </div>
      )}
    </div>
  )
}
ProductListEdit.propTypes = {
  match: PropTypes.instanceOf(Object).isRequired,
}

export default withRouter(ProductListEdit)
