import React from 'react'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({ // eslint-disable-line no-unused-vars
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(2),
  },
  title: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
}))

export default function OvershortDetailsView() {
  const classes = useStyles()

  return (
    <Paper className={classes.root} square>
      <Typography variant="h6" className={classes.title}>
        Overshort Details
      </Typography>
    </Paper>
  )
}
