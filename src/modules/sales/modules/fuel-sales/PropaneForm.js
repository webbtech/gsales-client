import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  Grid,
  Paper,
  TextField,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import SaveButton from '../../../shared/SaveButton'
import SectionTitle from '../../../shared/SectionTitle'
import { saveOtherFuel } from '../../actions'

const useStyles = makeStyles(theme => ({
  actionButton: {
    width: '100%',
  },
  buttonRow: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  container: {
    padding: theme.spacing(2),
  },
  error: {
    paddingLeft: theme.spacing(2),
    color: theme.palette.error.main,
  },
  paper: {
    marginTop: theme.spacing(3.5),
    marginBottom: theme.spacing(1.5),
  },
  numberInput: {
    textAlign: 'right',
  },
  textField: {
    width: 110,
    margin: 0,
  },
}))

const PropaneForm = () => {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)
  const [error, setError] = useState(null)
  const [fuelValues, setFuelValues] = useState({
    dollar: '',
    litre: '',
  })
  const dispatch = useDispatch()

  const { shift } = sales.shift.sales.result

  const handleChangeValue = (e, field) => {
    setFuelValues({ ...fuelValues, [field]: e.currentTarget.value })
  }

  const handleSubmit = () => {
    const params = {
      dollar: parseFloat(fuelValues.dollar),
      litre: parseFloat(fuelValues.litre),
      recordNum: shift.recordNum,
      shiftID: shift.id,
      stationID: shift.stationID,
    }
    if (Number.isNaN(params.dollar)) {
      setError('Missing or invalid Dollar value')
      return
    }
    if (Number.isNaN(params.litre)) {
      setError('Missing or invalid Litre value')
      return
    }
    dispatch(saveOtherFuel(params))
  }

  useEffect(() => {
    setFuelValues({ ...shift.otherFuel.propane })
  }, [shift.otherFuel.propane])

  return (
    <Paper square className={classes.paper}>
      <SectionTitle title="Other Propane Sales" />

      {error && <div className={classes.error}>{error}</div>}

      <Grid container className={classes.container} spacing={2}>
        <Grid item xs={2}>
          <TextField
            autoComplete="off"
            className={classes.textField}
            id="otherFuelDollar"
            inputProps={{
              className: classes.numberInput,
            }}
            label="Dollar"
            onChange={e => handleChangeValue(e, 'dollar')}
            margin="dense"
            type="number"
            value={fuelValues.dollar}
          />
        </Grid>

        <Grid item xs={2}>
          <TextField
            autoComplete="off"
            className={classes.textField}
            id="otherFuelLitre"
            inputProps={{
              className: classes.numberInput,
            }}
            label="Litre"
            onChange={e => handleChangeValue(e, 'litre')}
            margin="dense"
            type="number"
            value={fuelValues.litre}
          />
        </Grid>

        <Grid item xs={3}>
          <SaveButton
            submitHandler={handleSubmit}
            label="Save Propane Sales"
          />
        </Grid>
      </Grid>

    </Paper>
  )
}

export default PropaneForm
