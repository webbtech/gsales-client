import React from 'react'
import PropTypes from 'prop-types'

import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ClearIcon from '@material-ui/icons/Clear'

const useStyles = makeStyles(theme => ({
  button: {
    width: '100%',
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
}))

export default function CancelButton({ cancelHandler, label }) {
  const classes = useStyles()

  return (
    <Button
      className={classes.button}
      onClick={cancelHandler}
      variant="contained"
    >
      {label}
      <ClearIcon className={classes.rightIcon} />
    </Button>
  )
}
CancelButton.propTypes = {
  cancelHandler: PropTypes.func.isRequired,
  label: PropTypes.string,
}
CancelButton.defaultProps = {
  label: 'Clear',
}
