import React from 'react'

import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(theme => ({ // eslint-disable-line no-unused-vars
  root: {
    width: '100%',
  },
  title: {},
}))

export default function Index() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      non fuel sales index
    </div>
  )
}
