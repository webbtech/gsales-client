import React from 'react'

import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  maxAlert: {
    color: theme.palette.text.primary,
    padding: theme.spacing(2),
  },
}))

export default function NoRecords() {
  const classes = useStyles()
  return (
    <Typography variant="body2" className={classes.maxAlert}>
      There are no records found matching your criteria.
      <br />
      Consider redefining your search parameters.
    </Typography>
  )
}
