import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { Field, reduxForm } from 'redux-form'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import {
  AppBar,
  Button,
  Grid,
  Toolbar,
  Typography,
} from '@material-ui/core'

import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/ArrowBackIos'

import { makeStyles } from '@material-ui/core/styles'

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

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  form: {
    width: 600,
    padding: theme.spacing(2),
  },
  textField: {
    width: '100%',
  },
}))

let Form = (props) => {
  const {
    handleSubmit,
    match,
    pristine,
    submitting,
  } = props
  const classes = useStyles()
  const dispatch = useDispatch()
  const station = useSelector(state => state.station.item)

  useEffect(() => {
    if (match.params && match.params.stationID) {
      const { stationID } = match.params
      dispatch(fetchStation(stationID))
    }
  }, [dispatch, match.params])

  const onHandleSubmit = (values) => {
    dispatch(persistStation({ stationID: values.id, values: R.pick(fields, values) }))
  }

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
        onSubmit={handleSubmit(onHandleSubmit)}
        className={classes.form}
      >
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Field
              className={classes.textField}
              component={RenderTextField}
              label="Station Name"
              name="name"
              validate={required}
            />
          </Grid>

          <Grid item xs={6}>
            <Field
              className={classes.textField}
              component={RenderTextField}
              label="Street"
              name="street"
              validate={required}
            />
          </Grid>

          <Grid item xs={6}>
            <Field
              className={classes.textField}
              component={RenderTextField}
              label="City"
              name="city"
              validate={required}
            />
          </Grid>

          <Grid item xs={6}>
            <Field
              className={classes.textField}
              component={RenderTextField}
              label="Phone"
              name="phone"
              validate={required}
            />
          </Grid>

          <Grid item xs={12}>
            <Field
              component={RenderCheckboxWithLabel}
              label="Is Bobs Store?"
              name="isBobs"
              color="primary"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              disabled={pristine || submitting}
              color="primary"
              type="submit"
              variant="contained"
            >
              Update Station
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}
Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
}

Form = reduxForm({
  form: 'station',
  enableReinitialize: true,
})(Form)

export default connect(
  state => ({
    initialValues: state.station.item,
  }),
  {}
)(Form)
