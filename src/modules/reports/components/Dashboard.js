import React from 'react'
import { Link } from 'react-router-dom'

import { Button, Typography } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import { menuItems } from './Menu'

const useStyles = makeStyles(theme => ({
  root: {
    margin: '0px auto 0',
    padding: '20px',
    textAlign: 'center',
    width: 300,
  },
  button: {
    width: '100%',
    marginBottom: theme.spacing(0.75),
    marginTop: theme.spacing(0.75),
  },
}))

export default function Dashboard() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography variant="h5" className={classes.title}>
        Select Report
      </Typography>

      {menuItems.map(m => (
        <Button
          className={classes.button}
          color="secondary"
          component={Link}
          key={m.link}
          to={m.link}
          variant="contained"
        >
          {m.title}
        </Button>
      ))}
    </div>
  )
}
