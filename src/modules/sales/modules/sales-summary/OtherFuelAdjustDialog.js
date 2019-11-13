import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import {
  Dialog,
  Grid,
  TextField,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import CancelButton from '../../../shared/CancelButton'
import DialogAppBar from '../../../shared/DialogAppBar'
import SaveButton from '../../../shared/SaveButton'
import { fmtNumber } from '../../../../utils/fmt'
import { patchOtherFuel } from '../../actions'

const useStyles = makeStyles(theme => ({
  content: {
    margin: theme.spacing(2),
  },
  error: {
    color: theme.palette.error.main,
    fontWeight: '600',
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
  numberInput: {
    textAlign: 'right',
  },
  textField: {
    width: '100%',
  },
}))

const defaultFormValues = {
  description: '',
  dollar: '',
  litre: '',
}

export default function OtherFuelAdjustDialog(props) {
  const {
    onClose,
    open,
    shift,
  } = props
  const classes = useStyles()
  const [error, setError] = useState(null)
  const [state, setState] = useState(defaultFormValues)
  const dispatch = useDispatch()

  const handleClose = () => {
    onClose()
    setError(null)
    setState(defaultFormValues)
  }

  const handleFieldChange = (e, f) => {
    setState({ ...state, [f]: e.currentTarget.value })
  }

  const handleSubmit = () => {
    const params = {
      description: state.description,
      dollar: parseFloat(state.dollar),
      litre: parseFloat(state.litre),
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

    dispatch(patchOtherFuel(params))
    handleClose()
  }

  if (!shift.otherFuel) return null
  const { propane } = shift.otherFuel

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
    >
      <DialogAppBar
        closeHandler={handleClose}
        title="Adjust Other Fuel"
      />

      {error && <div className={classes.error}>{error}</div>}

      <div className={classes.content}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            {`Open Dollar: ${fmtNumber(propane.dollar)}`}
          </Grid>

          <Grid item xs={6}>
            {`Open Litre: ${fmtNumber(propane.litre, 3)}`}
          </Grid>

          <Grid item xs={6}>
            <TextField
              className={classes.textField}
              id="otherDollar"
              inputProps={{
                className: classes.numberInput,
              }}
              label="Dollar Adjust"
              onChange={e => handleFieldChange(e, 'dollar')}
              margin="dense"
              type="number"
              value={state.dollar}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              className={classes.textField}
              id="otherLitre"
              inputProps={{
                className: classes.numberInput,
              }}
              label="Litre Adjust"
              onChange={e => handleFieldChange(e, 'litre')}
              margin="dense"
              type="number"
              value={state.litre}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              className={classes.textField}
              id="adjustDescription"
              label="Description"
              margin="dense"
              multiline
              name="description"
              onChange={e => handleFieldChange(e, 'description')}
              value={state.description}
            />
          </Grid>

          <Grid item xs={8}>
            <SaveButton
              submitHandler={handleSubmit}
              label="Save Other Fuel Adjustment"
            />
          </Grid>

          <Grid item xs={4}>
            <CancelButton
              cancelHandler={handleClose}
              label="Cancel"
            />
          </Grid>
        </Grid>
      </div>
    </Dialog>
  )
}
OtherFuelAdjustDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  shift: PropTypes.instanceOf(Object).isRequired,
}
