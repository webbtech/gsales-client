import React from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
    padding: theme.spacing(4),
  },
}))

export default function CircularIndeterminate() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CircularProgress color="primary" />
    </div>
  )
}
