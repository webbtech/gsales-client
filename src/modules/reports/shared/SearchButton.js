import React from 'react'
import PropTypes from 'prop-types'

import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'

const useStyles = makeStyles(theme => ({
  button: {
    width: '100%',
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
}))

export default function SearchButton({ disabled, submitHandler }) {
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
      Search
      <SearchIcon className={classes.rightIcon} />
    </Button>
  )
}
SearchButton.propTypes = {
  disabled: PropTypes.bool,
  submitHandler: PropTypes.func.isRequired,
}
SearchButton.defaultProps = {
  disabled: false,
}
