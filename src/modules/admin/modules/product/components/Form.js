import React from 'react'
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

import { ProductCategories, ProductTypes } from '../constants'
import { persistProduct } from '../actions'

const R = require('ramda')

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  form: {
    marginTop: theme.spacing(1),
  },
  submitButton: {
    width: '100%',
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
  if (!values.name) {
    errors.name = 'Required'
  } else if (values.name.length < 3) {
    errors.name = 'Must be 3 characters or greater'
  }
  return errors
}

const fields = [
  'category',
  'commissionEligible',
  'cost',
  'name',
  'oilProduct',
  'sortOrder',
  'taxable',
  'type',
]

const defaultValues = {
  category: '',
  commissionEligible: true,
  cost: 0.00,
  name: '',
  oilProduct: true,
  sortOrder: 0,
  taxable: false,
  type: 'none',
}

let Form = (props) => {
  const {
    handleSubmit,
    onCloseHandler,
    pristine,
    submitting,
  } = props
  const classes = useStyles()
  const product = useSelector(state => state.product)
  const dispatch = useDispatch()

  function onHandleSubmit(vals) {
    const productID = vals.id || null
    const formVals = Object.assign({}, { ...defaultValues, ...vals })
    if (formVals.type === '') {
      formVals.type = 'none'
    }
    if (!formVals.sortOrder) {
      formVals.sortOrder = 1
    }
    dispatch(persistProduct({ productID, values: R.pick(fields, formVals) }))
    onCloseHandler()
  }

  const categoryChildren = ProductCategories.map(pc => <option key={pc} value={pc}>{pc}</option>)
  const typeChildren = ProductTypes.map(pc => <option key={pc} value={pc}>{pc}</option>)

  const isEdit = !!(product.item && product.item.productID)
  const formLabel = isEdit ? 'Edit Product' : 'Create New Product'

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
                className={classes.textField}
                component={RenderTextField}
                label="Name"
                name="name"
              />
            </Grid>

            <Grid item xs={6}>
              <Field
                className={classes.textField}
                component={RenderTextField}
                label="Cost"
                name="cost"
              />
            </Grid>

            <Grid item xs={6}>
              <Field
                className={classes.textField}
                component={RenderTextField}
                label="Sort Order"
                name="sortOrder"
                type="number"
              />
            </Grid>

            <Grid item xs={6}>
              <Field
                className={classes.textField}
                component={RenderSelectField}
                label="Category"
                name="category"
              >
                {categoryChildren}
              </Field>
            </Grid>

            <Grid item xs={6}>
              <Field
                className={classes.textField}
                component={RenderSelectField}
                label="Type"
                name="type"
              >
                {typeChildren}
              </Field>
            </Grid>

            <Grid item xs={6}>
              <Field
                component={RenderCheckboxWithLabel}
                label="Oil Product"
                name="oilProduct"
                color="primary"
              />
            </Grid>

            <Grid item xs={6}>
              <Field
                component={RenderCheckboxWithLabel}
                label="Commission Eligible"
                name="commissionEligible"
                color="primary"
              />
            </Grid>

            <Grid item xs={6}>
              <Field
                component={RenderCheckboxWithLabel}
                label="Taxable"
                name="taxable"
                color="primary"
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
                Save Product
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
  onCloseHandler: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
}

Form = reduxForm({
  form: 'productForm',
  enableReinitialize: true,
  validate,
})(Form)

export default connect(
  state => ({
    initialValues: state.product.items[state.product.item.productID],
  }),
  {}
)(Form)
