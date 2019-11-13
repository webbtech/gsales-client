import React from 'react'
import PropTypes from 'prop-types'

import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/SaveAlt'

const useStyles = makeStyles(theme => ({
  button: {
    width: '100%',
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
}))

export default function SaveButton(props) {
  const {
    disabled,
    label,
    submitHandler,
  } = props
  const classes = useStyles()

  return (
    <Button
      disabled={disabled}
      color="primary"
      className={classes.button}
      onClick={submitHandler}
      type="submit"
      variant="contained"
    >
      {label}
      <SaveIcon className={classes.rightIcon} />
    </Button>
  )
}
SaveButton.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  submitHandler: PropTypes.func.isRequired,
}
SaveButton.defaultProps = {
  disabled: false,
  label: null,
}
