import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { Field, reduxForm } from 'redux-form'
import { connect, useSelector, useDispatch } from 'react-redux'

import {
  AppBar,
  Button,
  DialogContent,
  Fab,
  Grid,
  Toolbar,
  Typography,
} from '@material-ui/core'

import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'

import {
  RenderCheckboxWithLabel,
  RenderSelectField,
  RenderTextField,
} from '../../../../shared/FormFields'

import { persistEmployee } from '../actions'
import { fetchStationList } from '../../station/actions'
import { capitalize } from '../../../../../utils/fmt'

const R = require('ramda')

const useStyles = makeStyles(theme => ({
  root: {
  },
  form: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  submitButton: {
    width: '100%',
  },
  textField: {
    width: '100%',
  },
  title: {
    flexGrow: 1,
  },
}))

const validate = (values) => {
  const errors = {}
  if (!values.nameFirst) {
    errors.nameFirst = 'Required'
  } else if (values.nameFirst.length < 3) {
    errors.name = 'Must be 3 characters or greater'
  }
  if (!values.nameLast) {
    errors.nameLast = 'Required'
  } else if (values.nameLast.length < 3) {
    errors.name = 'Must be 3 characters or greater'
  }
  return errors
}

const fields = [
  'active',
  'nameFirst',
  'nameLast',
  'notes',
  'primaryStationID',
]

const upper = value => value && capitalize(value)

let Form = (props) => {
  const {
    handleSubmit,
    initialValues,
    onCloseHandler,
    pristine,
    submitting,
  } = props
  const classes = useStyles()
  const employee = useSelector(state => state.employee)
  const station = useSelector(state => state.station)
  const dispatch = useDispatch()

  const activeState = (initialValues && initialValues.active !== undefined)
    ? initialValues.active
    : true
  const [state, setState] = React.useState({
    active: activeState,
  })

  useEffect(() => {
    dispatch(fetchStationList())
  }, [dispatch, state.active])

  const handleChange = name => (event) => {
    setState({ ...state, [name]: event.target.checked })
  }

  function onHandleSubmit(vals) {
    const employeeID = vals.id || null
    const formVals = Object.assign({}, { ...vals })

    dispatch(persistEmployee({ employeeID, values: R.pick(fields, formVals) }))
    onCloseHandler()
  }

  const isEdit = !!(employee.item && employee.item.employeeID)
  const formLabel = isEdit ? 'Edit Employee' : 'Create New Employee'

  let stationChildren
  if (station.isFetching === false) {
    stationChildren = Object.values(station.items)
      .map(s => <option key={s.id} value={s.id}>{s.name}</option>)
    stationChildren.unshift(<option key="0" />)
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.title}>
            {formLabel}
          </Typography>
          <Fab onClick={onCloseHandler} size="small">
            <CloseIcon />
          </Fab>
        </Toolbar>
      </AppBar>

      <DialogContent>
        <form
          onSubmit={handleSubmit(onHandleSubmit)}
          className={classes.form}
        >
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Field
                autoFocus
                className={classes.textField}
                component={RenderTextField}
                label="First Name"
                name="nameFirst"
                normalize={upper}
              />
            </Grid>

            <Grid item xs={6}>
              <Field
                className={classes.textField}
                component={RenderTextField}
                label="Last Name"
                name="nameLast"
                normalize={upper}
              />
            </Grid>

            <Grid item xs={6}>
              <Field
                className={classes.textField}
                component={RenderSelectField}
                helperText="Employee primary station"
                label="Primary Station"
                name="primaryStationID"
                placeholder="Select Station"
              >
                {stationChildren}
              </Field>
            </Grid>

            <Grid item xs={6}>
              <Field
                component={RenderCheckboxWithLabel}
                label="Active"
                name="active"
                color="primary"
                checked={state.active}
                onChange={handleChange('active')}
                value="active"
              />
            </Grid>

            <Grid item xs={12}>
              <Field
                className={classes.textField}
                component={RenderTextField}
                label="Notes"
                multiline
                name="notes"
                rowsMax="2"
              />
            </Grid>

            <Grid item xs={6}>
              <Button
                disabled={pristine || submitting}
                color="primary"
                className={classes.submitButton}
                type="submit"
                variant="contained"
              >
                Save Employee
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </div>
  )
}
Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.instanceOf(Object),
  onCloseHandler: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
}
Form.defaultProps = {
  initialValues: null,
}

Form = reduxForm({
  form: 'employeeForm',
  enableReinitialize: true,
  validate,
})(Form)

export default connect(
  state => ({
    initialValues: state.employee.item.employeeID
      ? state.employee.items[state.employee.item.employeeID]
      : {},
  }),
  {}
)(Form)
