import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { Field, reduxForm } from 'redux-form'
import { connect, useSelector, useDispatch } from 'react-redux'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import DialogContent from '@material-ui/core/DialogContent'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
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

const useStyles = makeStyles(theme => ({ // eslint-disable-line no-unused-vars
  root: {
  },
  form: {
  },
  textField: {
    width: 225,
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
          <Button color="inherit" onClick={onCloseHandler}>Close</Button>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <form
          onSubmit={handleSubmit(onHandleSubmit)}
          className={classes.form}
        >
          <div className="form-tbl">
            <div className="form-tbl-row">
              <div className="form-tbl-cell">
                <Field
                  autoFocus
                  className={classes.textField}
                  component={RenderTextField}
                  label="First Name"
                  name="nameFirst"
                  normalize={upper}
                />
              </div>

              <div className="form-tbl-cell">
                <Field
                  className={classes.textField}
                  component={RenderTextField}
                  label="Last Name"
                  name="nameLast"
                  normalize={upper}
                />
              </div>
            </div>

            <div className="form-tbl-row">
              <div className="form-tbl-cell">
                <Field
                  className={classes.textField}
                  component={RenderSelectField}
                  label="Primary Station"
                  name="primaryStationID"
                >
                  {stationChildren}
                </Field>
              </div>

              <div className="form-tbl-cell">
                <Field
                  component={RenderCheckboxWithLabel}
                  label="Active"
                  name="active"
                  color="primary"
                  checked={state.active}
                  onChange={handleChange('active')}
                  value="active"
                />
              </div>
            </div>

            <div className="form-tbl-row">
              <div className="form-tbl-cell">
                <Field
                  className={classes.textField}
                  component={RenderTextField}
                  label="Notes"
                  multiline
                  name="notes"
                  rowsMax="2"
                />
              </div>
            </div>

            <div className="form-tbl-row">
              <div className="form-tbl-cell" />
              <div className="form-tbl-cell">
                <Button
                  disabled={pristine || submitting}
                  color="primary"
                  type="submit"
                  variant="contained"
                >
                  Save Employee
                </Button>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </div>
  )
}
Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.func,
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
    initialValues: state.employee.items[state.employee.item.employeeID],
  }),
  {}
)(Form)
