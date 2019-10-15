import React from 'react'
import PropTypes from 'prop-types'

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  NativeSelect,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core'

// import Checkbox from '@material-ui/core/Checkbox'
// import FormControl from '@material-ui/core/FormControl'
// import FormControlLabel from '@material-ui/core/FormControlLabel'
// import FormHelperText from '@material-ui/core/FormHelperText'
// import Input from '@material-ui/core/Input'
// import InputLabel from '@material-ui/core/InputLabel'
// import NativeSelect from '@material-ui/core/NativeSelect'
// import Select from '@material-ui/core/Select'
// import TextField from '@material-ui/core/TextField'
// import FormGroup from '@material-ui/core/FormGroup'
// import { List, ListItem } from 'material-ui/List'
// import DatePicker from 'material-ui/DatePicker'
// import MenuItem from 'material-ui/MenuItem'
// import SelectField from 'material-ui/SelectField'
// import Subheader from 'material-ui/Subheader'

const RenderFromHelper = ({ touched, error }) => {
  if (!(touched && error)) {
    return false
  }
  return <FormHelperText>{touched && error}</FormHelperText>
}
RenderFromHelper.propTypes = {
  error: PropTypes.bool,
  touched: PropTypes.bool,
}
RenderFromHelper.defaultProps = {
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
    <InputLabel htmlFor={input.name}>{label}</InputLabel>
    <NativeSelect
      {...input}
      {...custom}
      // id={input.name}
      // input={<Input name={`${name}`} id="age-native-helper" />}
      // inputProps={{
      //   name: 'age',
      //   id: 'age-native-simple',
      // }}
    >
      {children}
    </NativeSelect>
    {RenderFromHelper({ touched, error })}
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

/* export const RenderCheckboxList = ({ // eslint-disable-line react/no-multi-comp
  children,
  input,
  label,
  meta: { touched },
  subheader,
}) =>
  // console.log('input in RenderCheckboxList:', input)
  // console.log('touched in RenderCheckboxList:', touched)
  (
    <List
      children={children}
    />
  )

RenderCheckboxList.propTypes = {
  children: PropTypes.object,
  input: PropTypes.object,
  subheader: PropTypes.string,
} */

/* export const RenderSelectField = ({ // eslint-disable-line react/no-multi-comp
  input,
  label,
  meta: { touched, error },
  children,
  ...custom
}) => (
  <SelectField
    floatingLabelText={label}
    errorText={touched && error} // eslint-disable-line react/jsx-sort-props
    {...input}
    onChange={(event, index, value) => input.onChange(value)}
      // children={menuItems}
      // children={children} // eslint-disable-line react/jsx-sort-props
    {...custom}
  >
    {children.map(item => (
      <MenuItem
        key={item}
        primaryText={item}
        value={item}
      />
    ))}
  </SelectField>
)
RenderSelectField.propTypes = {
  children: PropTypes.array,
  // defaultValue: PropTypes.string,
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  menuItems: PropTypes.array,
  meta: PropTypes.object.isRequired,
} */

/* export const RenderDatePicker = ({
  input, meta: { pristine, touched, error }, label, ...others
}) => { // eslint-disable-line react/no-multi-comp, no-unused-vars
  if (pristine && !input.value) {
    input.value = null
  }
  return (
    <DatePicker
      label={label}
      {...others}
      {...input}
      error={touched && !!error}
      errorText={error}
    />
  )
}
RenderDatePicker.propTypes = {
  defaultValue: PropTypes.instanceOf(Date),
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  meta: PropTypes.object.isRequired,
} */
