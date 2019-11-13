import React from 'react'
import PropTypes from 'prop-types'

import MomentUtils from '@date-io/moment'

import {
  FormControl,
  FormHelperText,
  InputLabel,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'

const useStyles = makeStyles(theme => ({
  formControl: {
    width: '100%',
  },
  select: {
    marginTop: theme.spacing(2),
  },
}))

export default function DateSelect(props) {
  const {
    field,
    helperText,
    label,
    selectHandler,
    value,
  } = props
  const classes = useStyles()

  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="startDate">
        {!value && label}
      </InputLabel>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <KeyboardDatePicker
          autoOk
          className={classes.select}
          format="YYYY-MM-DD"
          id={field}
          maxDate={new Date()}
          onChange={e => selectHandler(e)}
          value={value}
        />
      </MuiPickersUtilsProvider>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}
DateSelect.propTypes = {
  field: PropTypes.string.isRequired,
  helperText: PropTypes.string,
  label: PropTypes.string.isRequired,
  selectHandler: PropTypes.func.isRequired,
  value: PropTypes.string,
}
DateSelect.defaultProps = {
  helperText: null,
  value: null,
}
