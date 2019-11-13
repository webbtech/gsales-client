import React from 'react'
import PropTypes from 'prop-types'

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core'

const RenderFormHelper = ({ touched, error }) => {
  if (!(touched && error)) {
    return false
  }
  return <FormHelperText>{touched && error}</FormHelperText>
}
RenderFormHelper.propTypes = {
  error: PropTypes.bool,
  touched: PropTypes.bool,
}
RenderFormHelper.defaultProps = {
  error: false,
  touched: false,
}

export const RenderTextField = ({
  input,
  label,
  meta: { touched, invalid, error },
  ...custom
}) => (
  <TextField
    label={label}
    placeholder={label}
    error={touched && invalid}
    helperText={touched && error}
    {...input}
    {...custom}
    // errorText={touched && error}
    // helperText={label}
  />
)
RenderTextField.propTypes = {
  input: PropTypes.instanceOf(Object),
  label: PropTypes.string,
  meta: PropTypes.instanceOf(Object),
}
RenderTextField.defaultProps = {
  input: null,
  label: '',
  meta: null,
}

export const RenderCheckboxWithLabel = ({ input, label, ...rest }) => (
  <FormControlLabel
    control={(
      <Checkbox
        checked={Boolean(input.value)}
        onChange={input.onChange}
        value="isBobs"
        {...rest}

      />
    )}
    label={label}
  />
)
RenderCheckboxWithLabel.propTypes = {
  input: PropTypes.instanceOf(Object).isRequired,
  label: PropTypes.string.isRequired,
  meta: PropTypes.instanceOf(Object),
}
RenderCheckboxWithLabel.defaultProps = {
  meta: {},
}

export const RenderSelectField = ({
  input,
  label,
  meta: { touched, error },
  children,
  ...custom
}) => (
  <FormControl error={touched && error}>
    <TextField
      {...input}
      {...custom}
      id={input.name}
      select
      label={input.value ? '' : label}
      SelectProps={{
        native: true,
      }}
      margin="normal"
    >
      {children}
    </TextField>
  </FormControl>
)
RenderSelectField.propTypes = {
  children: PropTypes.instanceOf(Object),
  input: PropTypes.instanceOf(Object).isRequired,
  label: PropTypes.string.isRequired,
  meta: PropTypes.instanceOf(Object),
}
RenderSelectField.defaultProps = {
  children: null,
  meta: null,
}

export const RenderRadioButton = ({ input, ...rest }) => (
  <FormControl>
    <RadioGroup {...input} {...rest}>
      {rest.values.map(v => (
        <FormControlLabel
          control={<Radio />}
          key={v.value}
          label={v.label}
          value={v.value}
        />
      ))}
    </RadioGroup>
  </FormControl>
)
RenderRadioButton.propTypes = {
  input: PropTypes.instanceOf(Object).isRequired,
}
