import React from 'react'
import PropTypes from 'prop-types'

import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import { MONTH_NAMES } from '../constants'

const useStyles = makeStyles(theme => ({ // eslint-disable-line
  formControl: {
    width: '100%',
  },
}))

export default function MonthSelector(props) {
  const {
    helperText,
    label,
    value,
    setValueHandler,
  } = props
  const classes = useStyles()

  return (
    <FormControl className={classes.formControl}>
      <InputLabel>{label}</InputLabel>
      <Select
        id="year"
        value={value}
        onChange={e => setValueHandler(e.target.value)}
      >
        {MONTH_NAMES.map((mLabel, month) => (
          <MenuItem value={month} key={month}>{mLabel}</MenuItem> // eslint-disable-line
        ))}
      </Select>
      {helperText && (
        <FormHelperText id="month-helper-text">
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  )
}
MonthSelector.propTypes = {
  helperText: PropTypes.string,
  label: PropTypes.string.isRequired,
  setValueHandler: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
}
MonthSelector.defaultProps = {
  helperText: null,
  value: '',
}
