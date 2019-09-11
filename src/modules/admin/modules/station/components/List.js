import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuIcon from '@material-ui/icons/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'

import { fetchStationList } from '../actions'

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
        </Menu>
      </React.Fragment>
    )}
  </PopupState>
)
MenuPopupState.propTypes = {
  station: PropTypes.instanceOf(Object).isRequired,
}

const List = () => {
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
      <div className="tbl" style={{ width: '100%' }}>
        <div className="tbl-head">
          <div className="tbl-col text-left">Name</div>
          <div className="tbl-col text-left">Street</div>
          <div className="tbl-col text-left">Phone</div>
        </div>
        {Object.values(station.items).map(s => (
          <div key={s.id} className="tbl-row">
            <div className="tbl-cell no-wrap">{s.name}</div>
            <div className="tbl-cell">{s.street}</div>
            <div className="tbl-cell no-wrap">{s.phone}</div>
            <div className="tbl-cell">
              <MenuPopupState station={s} />
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  )
}

export default List
