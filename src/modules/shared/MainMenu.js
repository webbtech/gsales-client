import React from 'react'

import { Link } from 'react-router-dom'

import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuIcon from '@material-ui/icons/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'

const menuItems = [
  {
    link: '/sales',
    label: 'Sales Data',
  },
  {
    link: '/admin',
    label: 'Administration',
  },
  {
    link: '/reports',
    label: 'Reports',
  },
  {
    link: '/profile/',
    label: 'Profile',
  },
  {
    link: '/auth/logout',
    label: 'Logout',
  },
]

const useStyles = makeStyles(theme => ({ // eslint-disable-line no-unused-vars
  root: {
    flexGrow: 1,
  },
  menuButton: {
  },
}))

export default function MainMenu() {
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
    <React.Fragment>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="menu"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        {menuItems.map(item => (
          <MenuItem key={item.link} onClick={handleClose} component={Link} to={item.link}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  )
}
