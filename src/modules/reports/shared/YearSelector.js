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

import { setYears } from '../utils'

const useStyles = makeStyles(theme => ({ // eslint-disable-line
  formControl: {
    width: '100%',
  },
}))

export default function YearSelector(props) {
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
        {setYears().map(yr => (
          <MenuItem key={yr} value={yr}>{yr}</MenuItem>
        ))}
      </Select>
      {helperText && (
        <FormHelperText id="year-helper-text">
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  )
}
YearSelector.propTypes = {
  helperText: PropTypes.string,
  label: PropTypes.string.isRequired,
  setValueHandler: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
}
YearSelector.defaultProps = {
  helperText: null,
  value: '',
}
