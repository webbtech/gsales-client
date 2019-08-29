import React from 'react'

// import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import Title from '../../shared/Title'

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
      <Title>Oil Product Sales</Title>
    </div>
  )
}
