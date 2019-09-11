import React from 'react'

import { Auth } from 'aws-amplify'
import { Link, withRouter } from 'react-router-dom'

import Divider from '@material-ui/core/Divider'
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
  /* {
    link: '/profile/',
    label: 'Profile',
  }, */
]

const useStyles = makeStyles(theme => ({ // eslint-disable-line no-unused-vars
  root: {
    flexGrow: 1,
  },
  menuButton: {
  },
}))

function MainMenu({ history }) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const classes = useStyles()

  function handleClick(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  function handleLogout() {
    console.log('logging out')
    Auth.signOut()
      .then((data) => {
        console.log('data form then: ', data)
        // window.location.replace('/')
        // history.push('/')
      })
      .catch(err => console.log(err))
  }

  // console.log('history:', history)

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
        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </React.Fragment>
  )
}

export default withRouter(MainMenu)
