import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import {
  Button,
  Grid,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import CloudDownloadIcon from '@material-ui/icons/CloudDownload'

import moment from 'moment'

import MonthSelector from '../../shared/MonthSelector'
import Title from '../../shared/Title'
import YearSelector from '../../shared/YearSelector'
import useDataApi from '../../shared/fetchXLSAPI'
import { DWNLD_XLS_FUEL_SALES } from '../../constants'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    width: '100%',
  },
  button: {
    width: '100%',
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
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
  const [{ payload, isLoading, isError }, doFetch] = useDataApi()

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

  const downloadReport = () => {
    const date = moment().month(formValues.month).year(formValues.year).format('YYYY-MM')
    const postObj = {
      date,
      type: DWNLD_XLS_FUEL_SALES,
    }
    doFetch(postObj)
  }

  const url = payload && payload.data ? payload.data.url : null
  useEffect(() => {
    if (url) {
      window.location.href = url
      // we could also do: window.open(url)
    }
  }, [url])

  return (
    <div className={classes.root}>
      <Title>Fuel Sales Download</Title>

      <Grid container spacing={2}>
        <Grid item xs={1}>
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

        <Grid item xs={2}>
              <Button
                className={classes.button}
                color="secondary"
                disabled={isLoading}
                onClick={downloadReport}
                variant="contained"
              >
                {isLoading ? 'Stand By...' : 'Download XLS'}
                <CloudDownloadIcon className={classes.rightIcon} />
              </Button>
            </Grid>
      </Grid>
    </div>
  )
}