import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Field, reduxForm } from 'redux-form'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/ArrowBackIos'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/styles'

import { fetchStation, persistStation } from '../actions'

import {
  RenderCheckboxWithLabel,
  RenderTextField,
} from '../../../../shared/FormFields'

const R = require('ramda')

const fields = [
  'name',
  'street',
  'city',
  'phone',
  'isBobs',
]

const required = value => (value ? undefined : 'Required')

const styles = {
  root: {
    width: '100%',
  },
  form: {
    width: 600,
  },
  textField: {
    width: 275,
  },
}

class Form extends Component {
  constructor(props) {
    super(props)
    this.onHandleSubmit = this.onHandleSubmit.bind(this)
  }

  componentDidMount() {
    const {
      match,
      actions,
    } = this.props

    if (match.params && match.params.stationID) {
      this.stationID = match.params.stationID
      actions.fetchStation(this.stationID)
    }
  }

  onHandleSubmit(values) {
    const { actions } = this.props
    actions.persistStation({ stationID: values.id, values: R.pick(fields, values) })
  }

  render() {
    const {
      classes,
      handleSubmit,
      pristine,
      station,
      submitting,
    } = this.props

    if (station.isFetching) return <div>Loading...</div>

    return (
      <div className={classes.root}>
        <AppBar position="static" color="secondary">
          <Toolbar>
            <IconButton edge="start" component={Link} to="/admin/stations" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit">
              Station Details Form
            </Typography>
          </Toolbar>
        </AppBar>
        <form
          onSubmit={handleSubmit(this.onHandleSubmit)}
          className={classes.form}
        >
          <div className="form-tbl">
            <div className="form-tbl-row">
              <div className="form-tbl-cell">
                <Field
                  className={classes.textField}
                  component={RenderTextField}
                  label="Station Name"
                  name="name"
                  validate={required}
                />
              </div>
              <div className="form-tbl-cell">
                <Field
                  className={classes.textField}
                  component={RenderTextField}
                  label="Street"
                  name="street"
                  validate={required}
                />
              </div>
            </div>
            <div className="form-tbl-row">
              <div className="form-tbl-cell">
                <Field
                  className={classes.textField}
                  component={RenderTextField}
                  label="City"
                  name="city"
                  validate={required}
                />
              </div>
              <div className="form-tbl-cell">
                <Field
                  className={classes.textField}
                  component={RenderTextField}
                  label="Phone"
                  name="phone"
                  validate={required}
                />
              </div>
            </div>

            <div className="form-tbl-row">
              <div className="form-tbl-cell">
                <Field
                  component={RenderCheckboxWithLabel}
                  label="Is Bobs Store?"
                  name="isBobs"
                  color="primary"
                />
              </div>
              <div className="form-tbl-cell" />
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
                  Update Station
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
Form.propTypes = {
  actions: PropTypes.instanceOf(Object).isRequired,
  classes: PropTypes.instanceOf(Object).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
  pristine: PropTypes.bool.isRequired,
  station: PropTypes.instanceOf(Object).isRequired,
  submitting: PropTypes.bool.isRequired,
}

function mapStateToProps(state) {
  return {
    alerts: state.alerts,
    station: state.station,
    initialValues: state.station.item,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      fetchStation,
      persistStation,
    }, dispatch),
  }
}

const ReduxForm = reduxForm({
  form: 'station',
  // validate,
  enableReinitialize: true,
})(Form)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ReduxForm))
