import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { Field, reduxForm } from 'redux-form'
import { connect, useSelector, useDispatch } from 'react-redux'

import {
  AppBar,
  Button,
  Grid,
  Toolbar,
  Typography,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import Loader from '../../../../shared/Loader'
import { RenderTextField } from '../../../../shared/FormFields'
import { fetchConfig, persistConfig } from '../actions'

const R = require('ramda')

const useStyles = makeStyles(theme => ({
  root: {
    width: 500,
  },
  form: {
    padding: theme.spacing(1),
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
  'colouredDieselDsc',
  'commission',
  'discrepancyFlag',
  'hST',
  'hiGradePremium',
]

let Config = (props) => {
  const {
    handleSubmit,
    pristine,
    submitting,
  } = props
  const classes = useStyles()
  const config = useSelector(state => state.config)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchConfig())
  }, [dispatch])

  function onHandleSubmit(vals) {
    const formVals = Object.assign({}, { ...vals })
    dispatch(persistConfig({ values: R.pick(fields, formVals) }))
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.title}>
            Configuration
          </Typography>
        </Toolbar>
      </AppBar>

      <div className={classes.form}>
        {config.isFetching ? (
          <Loader />
        ) : (
          <form
            onSubmit={handleSubmit(onHandleSubmit)}
            className={classes.form}
          >
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Field
                  className={classes.textField}
                  component={RenderTextField}
                  label="Coloured Diesel Discount"
                  name="colouredDieselDsc"
                  type="number"
                />
              </Grid>

              <Grid item xs={6}>
                <Field
                  className={classes.textField}
                  component={RenderTextField}
                  label="Commission (%)"
                  name="commission"
                  type="number"
                />
              </Grid>

              <Grid item xs={6}>
                <Field
                  className={classes.textField}
                  component={RenderTextField}
                  label="Discrepancy Flag Value"
                  name="discrepancyFlag"
                  type="number"
                />
              </Grid>

              <Grid item xs={6}>
                <Field
                  className={classes.textField}
                  component={RenderTextField}
                  label="HST"
                  name="hST"
                  type="number"
                />
              </Grid>

              <Grid item xs={6}>
                <Field
                  className={classes.textField}
                  component={RenderTextField}
                  label="Hi-Grade Premium"
                  name="hiGradePremium"
                  type="number"
                />
              </Grid>

              <Grid item xs={6} />
              <Grid item xs={6}>
                <Button
                  className={classes.submitButton}
                  disabled={pristine || submitting}
                  color="primary"
                  type="submit"
                  variant="contained"
                >
                  Save Configuration
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </div>
    </div>
  )
}
Config.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
}

Config = reduxForm({
  form: 'employeeForm',
  enableReinitialize: true,
  validate,
})(Config)

export default connect(
  state => ({
    initialValues: state.config.values,
  }),
  {}
)(Config)
