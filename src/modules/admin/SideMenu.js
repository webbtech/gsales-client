import React from 'react'
import PropTypes from 'prop-types'

import { Link, withRouter } from 'react-router-dom'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'

const R = require('ramda')

const links = [
  {
    link: '/admin/stations',
    label: 'Stations',
  },
  {
    link: '/admin/products',
    label: 'Products',
  },
  {
    link: '/admin/employees',
    label: 'Employees',
  },
  {
    link: '/admin/config',
    label: 'Configuration',
  },
]
const useStyles = makeStyles(theme => ({ // eslint-disable-line no-unused-vars
  drawer: {
    boxShadow: 'rgba(0,0,0,.25) 0px 1px 8px',
    width: '200px',
    height: '100%',
  },
}))

function SideMenu({ location }) {
  const idx = R.findIndex(R.propEq('link', location.pathname))(links)
  const sIdx = idx > -1 ? idx : 0
  const classes = useStyles()
  const [selectedIndex, setSelectedIndex] = React.useState(sIdx)

  function handleListItemClick(event, index) {
    setSelectedIndex(index)
  }

  return (
    <aside
      className={classes.drawer}
    >
      <List component="nav" aria-label="main mailbox folders">
        {links.map((l, index) => (
          <ListItem
            key={l.link}
            button
            selected={selectedIndex === index}
            onClick={event => handleListItemClick(event, index)}
            to={l.link}
            component={Link}
          >
            <ListItemText primary={l.label} />
          </ListItem>
        ))}
      </List>
    </aside>
  )
}
SideMenu.propTypes = {
  location: PropTypes.instanceOf(Object).isRequired,
}

export default withRouter(SideMenu)
