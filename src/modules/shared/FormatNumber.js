import React from 'react'
import PropTypes from 'prop-types'

import { fmtNumber } from '../../utils/fmt'

export default function FormatNumber({ decimal, value, style }) {
  if (Number.isNaN(value)) return null
  const dec = Number(decimal)
  const styles = Object.assign({}, style)
  if (value < 0) {
    styles.color = '#E10207'
  }
  const val = value !== null ? fmtNumber(value, dec) : ''
  return <span style={styles}>{val}</span>
}
FormatNumber.propTypes = {
  decimal: PropTypes.number,
  style: PropTypes.instanceOf(Object),
  value: PropTypes.number,
}
FormatNumber.defaultProps = {
  decimal: 2,
  style: null,
  value: null,
}
