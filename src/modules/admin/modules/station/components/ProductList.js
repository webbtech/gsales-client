import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { Link, withRouter } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/ArrowBackIos'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { fetchStation } from '../actions'
import { fetchProducts } from '../../product/actions'

const useStyles = makeStyles(theme => ({ // eslint-disable-line no-unused-vars
  root: {
    width: 500,
  },
  title: {
    flexGrow: 1,
  },
}))

const List = ({ station, products }) => {
  if (!Object.keys(station).length || !Object.keys(products).length) {
    return <div>Loading..</div>
  }
  let c = 0 // eslint-disable-line
  return Object.values(station.products).map((s) => {
    const product = products[s.productID]
    c += 1
    return (
      <div key={s.id} className="tbl-row">
        <div className="tbl-cell no-wrap">{product.name}</div>
        <div className="tbl-cell no-wrap">{product.category}</div>
        <div className="tbl-cell no-wrap">{s.sortOrder}</div>
      </div>
    )
  })
}

function ProductList({ match }) {
  const classes = useStyles()
  const station = useSelector(state => state.station)
  const product = useSelector(state => state.product)
  const dispatch = useDispatch()

  const { stationID } = match.params

  useEffect(() => {
    dispatch(fetchStation(stationID))
    dispatch(fetchProducts())
  }, [dispatch, stationID])

  const stationName = !station.isFetching && station.item ? station.item.name : ''

  return (
    <div className={classes.root}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <IconButton edge="start" component={Link} to="/admin/stations" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.title}>
            {`${stationName} Products List`}
          </Typography>
          <Button color="inherit" component={Link} to={`/admin/stations/product-list-edit/${station.item.id}`}>Products Edit</Button>
        </Toolbar>
      </AppBar>
      {station.isFetching || product.isFetching ? (
        <div>Loading...</div>
      ) : (
        <div className="tbl" style={{ width: '100%' }}>
          <div className="tbl-head">
            <div className="tbl-col text-left">Product</div>
            <div className="tbl-col text-left">Category</div>
            <div className="tbl-col text-left">Sort</div>
          </div>
          <List station={station.item} products={product.items} />
        </div>
      )}
    </div>
  )
}
ProductList.propTypes = {
  match: PropTypes.instanceOf(Object).isRequired,
}

export default withRouter(ProductList)
