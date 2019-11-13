import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import {
  Button,
  Grid,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import CloudDownloadIcon from '@material-ui/icons/CloudDownload'

import moment from 'moment'

import CancelButton from '../../../shared/CancelButton'
import MonthSelector from '../../shared/MonthSelector'
import Report from './Report'
import SearchButton from '../../shared/SearchButton'
import Title from '../../shared/Title'
import YearSelector from '../../shared/YearSelector'
import { clearReport, fetchMonthlySales } from '../../actions'

const useStyles = makeStyles(theme => ({
  formControl: {
    width: '100%',
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  root: {
    padding: theme.spacing(2),
  },
}))

const dte = moment().subtract(1, 'months')
const defaultFormValues = {
  month: dte.month(),
  year: Number(dte.format('YYYY')),
}

export default function Index() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [formValues, setFormValues] = useState(defaultFormValues)

  const getDate = () => (
    moment()
      .date(1)
      .month(formValues.month)
      .year(formValues.year)
      .format('YYYY-MM-DD')
  )

  const handleChangeField = (value, field) => {
    setFormValues({ ...formValues, [field]: value })
  }

  const handleSubmit = () => {
    const params = {
      date: getDate(),
    }
    dispatch(fetchMonthlySales(params))
  }

  const handleClearFields = () => {
    setFormValues(defaultFormValues)
  }

  useEffect(() => (
    () => {
      dispatch(clearReport())
    }
  ), [dispatch])

  // Load last months data on component load
  useEffect(() => {
    handleSubmit()
  }, []) // eslint-disable-line

  return (
    <div className={classes.root}>
      <Title>Monthly Sales Report</Title>

      <Grid container spacing={2}>
        <Grid item xs={2}>
          <YearSelector
            label="Year"
            setValueHandler={value => handleChangeField(value, 'year')}
            value={formValues.year}
          />
        </Grid>

        <Grid item xs={2}>
          <MonthSelector
            label="Month"
            setValueHandler={value => handleChangeField(value, 'month')}
            value={formValues.month}
          />
        </Grid>

        <Grid item xs={8}>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <SearchButton
                disabled={!(formValues.month && formValues.year)}
                submitHandler={handleSubmit}
              />
            </Grid>

            <Grid item xs={2}>
              <CancelButton cancelHandler={handleClearFields} label="Reset" />
            </Grid>

            <Grid item xs={3}>
              <Button
                className={classes.button}
                color="secondary"
                disabled
                // onClick={}
                variant="contained"
              >
                Download CSV File
                <CloudDownloadIcon className={classes.rightIcon} />
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Report date={getDate()} />
    </div>
  )
}
