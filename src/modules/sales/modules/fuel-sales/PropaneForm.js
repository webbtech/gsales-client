import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core'

import SaveIcon from '@material-ui/icons/SaveAlt'
import { makeStyles } from '@material-ui/core/styles'

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
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  textField: {
    width: 110,
    margin: 0,
  },
  title: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
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
      <Typography variant="h6" className={classes.title}>
        Other Propane Sales
      </Typography>

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
          <Button
            className={classes.actionButton}
            color="primary"
            onClick={handleSubmit}
            type="submit"
            variant="contained"
          >
            Save Propane Sales
            <SaveIcon className={classes.rightIcon} />
          </Button>
        </Grid>
      </Grid>

    </Paper>
  )
}

export default PropaneForm
