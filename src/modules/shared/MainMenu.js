import React, { useEffect, useState } from 'react'

import { Auth } from 'aws-amplify'
import { Link, withRouter } from 'react-router-dom'

import {
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core'

import MenuIcon from '@material-ui/icons/Menu'
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
]

const useStyles = makeStyles(theme => ({
  name: {
    marginRight: theme.spacing(1),
  },
  root: {
    flexGrow: 1,
  },
}))

function MainMenu() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [user, setUser] = useState({
    email: '',
    name: '',
    username: '',
  })
  const open = Boolean(anchorEl)
  const classes = useStyles()

  function handleClick(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  function handleLogout() {
    Auth.signOut()
      .then((data) => {
        console.log('data form then: ', data) // eslint-disable-line no-console
      })
      .catch(err => console.log(err)) // eslint-disable-line no-console
  }

  useEffect(() => {
    const getAuthUser = async () => {
      try {
        const u = await Auth.currentAuthenticatedUser()
        const { email, name } = u.signInUserSession.idToken.payload
        const { username } = u
        setUser({ email, name, username })
      } catch (e) {
        console.error(e) // eslint-disable-line
      }
    }
    getAuthUser()
  }, [])

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
        <Typography variant="body1" className={classes.name}>{user.name}</Typography>
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
