import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'

import { fetchStationList } from '../actions'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: 'calc(100vh - 65px)',
  },
  main: {
    padding: theme.spacing(2.5),
  },
}))

const MenuPopupState = ({ station }) => (
  <PopupState variant="popover" popupId="demoMenu">
    {popupState => (
      <React.Fragment>
        <IconButton
          aria-controls={station.id}
          aria-haspopup="true"
          aria-label="menu"
          color="inherit"
          edge="start"
          {...bindTrigger(popupState)}
        >
          <MenuIcon />
        </IconButton>
        <Menu {...bindMenu(popupState)}>
          <MenuItem
            onClick={popupState.close}
            component={Link}
            to={`/admin/stations/details/${station.id}`}
          >
            Details
          </MenuItem>
          <MenuItem
            component={Link}
            to={`/admin/stations/product-list/${station.id}`}
          >
            Products
          </MenuItem>
          <MenuItem
            component={Link}
            to={`/admin/stations/dispensers/${station.id}`}
          >
            Dispensers
          </MenuItem>
        </Menu>
      </React.Fragment>
    )}
  </PopupState>
)
MenuPopupState.propTypes = {
  station: PropTypes.instanceOf(Object).isRequired,
}

const List = () => {
  const classes = useStyles()
  const station = useSelector(state => state.station)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchStationList())
  }, [dispatch])

  if (station.isFetching) return <div>Loading...</div>

  return (
    <React.Fragment>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Station List
          </Typography>
        </Toolbar>
      </AppBar>

      <Table size="small" className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Street</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>

        <TableBody>
          {Object.values(station.items).map(s => (
            <TableRow key={s.id}>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.street}</TableCell>
              <TableCell>{s.phone}</TableCell>
              <TableCell padding="none">
                <MenuPopupState station={s} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  )
}

export default List
