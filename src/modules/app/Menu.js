import React from 'react'
import { Link } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import TitleBar from './TitleBar'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    margin: '60px auto 0',
    padding: '20px',
    textAlign: 'center',
    width: 300,
  },
  button: {
    width: '100%',
    marginBottom: theme.spacing(0.75),
    marginTop: theme.spacing(0.75),
  },
  title: {},
}))

export default function Menu() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <TitleBar />
      <Paper className={classes.paper}>
        <Typography variant="h5" className={classes.title}>
          Select Activity
        </Typography>
        <Button
          className={classes.button}
          color="secondary"
          component={Link}
          label="Sales Data"
          to="/sales"
          variant="contained"
        >
          Sales Data
        </Button>
        <Button
          className={classes.button}
          color="secondary"
          component={Link}
          to="/admin"
          variant="contained"
        >
          Administration
        </Button>
        <Button
          className={classes.button}
          color="secondary"
          component={Link}
          to="/reports"
          variant="contained"
        >
          Reports
        </Button>
      </Paper>
    </div>
  )
}
