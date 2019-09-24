import React from 'react'
import PropTypes from 'prop-types'

import { fmtNumber } from '../../utils/fmt'

export default function FormatNumber({ decimal, value, style }) {
  const dec = Number(decimal)
  const styles = Object.assign({}, style)
  if (value < 0) {
    styles.color = '#E10207'
  }
  return <span style={styles}>{fmtNumber(value, dec)}</span>
}
FormatNumber.propTypes = {
  decimal: PropTypes.number,
  value: PropTypes.number.isRequired,
  style: PropTypes.instanceOf(Object),
}
FormatNumber.defaultProps = {
  decimal: 2,
  style: null,
}
