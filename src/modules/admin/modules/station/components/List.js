import React, { useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

// import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuIcon from '@material-ui/icons/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import { fetchStationList } from '../actions'

/* const StationMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'center',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
)) */

const List = () => {
  const station = useSelector(state => state.station)
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  useEffect(() => {
    dispatch(fetchStationList())
  }, [dispatch])

  function handleClick(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

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
              <IconButton
                aria-controls={s.id}
                aria-haspopup="true"
                aria-label="menu"
                color="inherit"
                edge="start"
                onClick={handleClick}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                id={s.id}
                keepMounted
                onClose={handleClose}
                open={open}
              >
                <MenuItem component={Link} to={`/admin/stations/details/${s.id}`}>{s.id}</MenuItem>
                <MenuItem component={Link} to={`/admin/stations/details/56cf1815982d82b0f3000002`}>Chippawa Store</MenuItem>
                <MenuItem component={Link} to={`/admin/stations/product-list/56cf1815982d82b0f3000001`}>Bridge Products</MenuItem>
                <MenuItem component={Link} to={`/admin/stations/product-list-edit/56cf1815982d82b0f3000001`}>Set Bridge Products</MenuItem>
              </Menu>
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  )
}

export default List
