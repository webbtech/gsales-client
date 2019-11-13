import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { Link, withRouter } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import {
  AppBar,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Toolbar,
  Typography,
} from '@material-ui/core'

import MenuIcon from '@material-ui/icons/ArrowBackIos'
import { makeStyles } from '@material-ui/core/styles'

import Loader from '../../../../shared/Loader'
import { fetchMonthlyStation } from '../actions'
import { fetchProducts } from '../../product/actions'

const useStyles = makeStyles(theme => ({
  root: {
    width: 500,
    marginBottom: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

const List = ({ station, products }) => {
  if (!Object.keys(station).length || !Object.keys(products).length) {
    return null
  }
  let c = 0 // eslint-disable-line
  return Object.values(station.products).map((s) => {
    const product = products[s.productID]
    c += 1
    return (
      <TableRow key={s.id}>
        <TableCell>{product.name}</TableCell>
        <TableCell>{product.category}</TableCell>
        <TableCell>{s.sortOrder}</TableCell>
      </TableRow>
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
    dispatch(fetchMonthlyStation(stationID))
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
        <Loader />
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Sort</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <List station={station.item} products={product.items} />
          </TableBody>
        </Table>
      )}
    </div>
  )
}
ProductList.propTypes = {
  match: PropTypes.instanceOf(Object).isRequired,
}

export default withRouter(ProductList)
