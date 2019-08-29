import React from 'react'

import { Link } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuIcon from '@material-ui/icons/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    paddingLeft: theme.spacing(1),
  },
}))

const menuItems = [
  { id: 'attendant', link: '/reports/attendant-activity', title: 'Attendant Activity' },
  { id: 'monthly', link: '/reports/monthly-sales', title: 'Monthly Sales' },
  { id: 'shift', link: '/reports/shift', title: 'Shifts' },
  { id: 'product-sales', link: '/reports/product-sales', title: 'Product Sales' },
  { id: 'oil-product-sales', link: '/reports/oil-product-sales', title: 'Oil Product Sales' },
]

export default function ReportMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const classes = useStyles()

  function handleClick(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  return (
    <div>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <IconButton
            edge="start"
            // className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MenuIcon />
            <Typography variant="subtitle1" className={classes.title}>
              Select Report
            </Typography>
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {menuItems.map(item => (
              <MenuItem key={item.id} onClick={handleClose} component={Link} to={item.link}>
                {item.title}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  )
}
