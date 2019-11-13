import React from 'react'
import PropTypes from 'prop-types'

import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  title: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
}))

export default function SectionTitle({ title }) {
  const classes = useStyles()
  return (
    <Typography variant="h6" className={classes.title}>
      {title}
    </Typography>
  )
}
SectionTitle.propTypes = {
  title: PropTypes.string.isRequired,
}
