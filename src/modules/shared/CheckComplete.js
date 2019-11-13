import React from 'react'
import PropTypes from 'prop-types'

import ClearIcon from '@material-ui/icons/Clear'
import DoneIcon from '@material-ui/icons/Done'

export default function CheckComplete({ value }) {
  return value ? <DoneIcon color="secondary" /> : <ClearIcon color="error" />
}
CheckComplete.propTypes = {
  value: PropTypes.bool.isRequired,
}
