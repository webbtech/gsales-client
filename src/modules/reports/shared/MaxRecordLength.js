import React from 'react'
import PropTypes from 'prop-types'

import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  maxAlert: {
    color: theme.palette.text.primary,
    padding: theme.spacing(2),
  },
}))

export default function MaxRecordLength({ maxLength, maxLengthExceeded }) {
  const classes = useStyles()
  if (!maxLengthExceeded) return null

  return (
    <Typography variant="body2" className={classes.maxAlert}>
      {`NOTE: You have hit the limit of maximum report records set at: ${maxLength}`}
      <br />
      Redefine your search parameters to ensure accurate results.
    </Typography>
  )
}
MaxRecordLength.propTypes = {
  maxLength: PropTypes.number.isRequired,
  maxLengthExceeded: PropTypes.bool.isRequired,
}
