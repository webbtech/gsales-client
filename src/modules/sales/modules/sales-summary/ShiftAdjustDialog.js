import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import {
  Dialog,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'
import { getFieldLabel, getCashCardsFieldLabel } from '../../utils'

import DialogAppBar from '../../../shared/DialogAppBar'
import CancelButton from '../../../shared/CancelButton'
import SaveButton from '../../../shared/SaveButton'
import { adjustShiftSummary } from '../../actions'

const R = require('ramda')

const useStyles = makeStyles(theme => ({
  content: {
    margin: theme.spacing(2),
  },
  formControl: {
    width: '100%',
  },
  numberInput: {
    textAlign: 'right',
  },
  textField: {
    width: '100%',
  },
}))

const ShiftAdjustDialog = (props) => {
  const {
    field,
    onClose,
    open,
    shift,
    type,
  } = props
  const classes = useStyles()
  const [state, setState] = useState({})
  const dispatch = useDispatch()

  const handleClose = () => {
    onClose()
    setState({})
  }

  const handleFieldChange = (e, f) => {
    setState({ ...state, [f]: e.currentTarget.value })
  }

  const handleSubmit = () => {
    const params = {
      adjustment: {
        field,
        adjustValue: parseFloat(state[field]),
        description: state.description,
      },
      shift,
      recordNum: shift.recordNum,
      stationID: shift.stationID,
    }
    dispatch(adjustShiftSummary(params))
    handleClose()
  }

  const setFieldValue = useCallback(
    (f) => {
      const val = R.path(f.split('.'), shift)
      setState({ ...state, [f]: val })
    },
    [field, shift] // eslint-disable-line
  )

  const getFieldLabelFunc = type === 'misc' ? getFieldLabel : getCashCardsFieldLabel

  useEffect(() => {
    if (field) {
      setFieldValue(field)
    }
  }, [field, setFieldValue])

  if (!field) return null

  const metaField = field.replace('.', ':')
  let calcs = ''

  if (R.hasPath(['meta', 'calculations', metaField], shift)) {
    calcs = shift.meta.calculations[metaField]
  }

  const title = type === 'misc' ? 'Adjust Misc Value' : 'Adjust Cash & Cards Value'

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
    >
      <DialogAppBar
        closeHandler={handleClose}
        title={title}
      />

      <div className={classes.content}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <FormControl className={classes.formControl}>
              <TextField
                autoFocus={!state[field]}
                className={classes.textField}
                id={field}
                inputProps={{
                  className: classes.numberInput,
                }}
                label={getFieldLabelFunc(field)}
                name="value"
                onChange={e => handleFieldChange(e, field)}
                margin="dense"
                type="number"
                value={state[field] || ''}
              />
              <FormHelperText id="field-helper-text">
                {calcs}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={8}>
            <FormControl className={classes.formControl}>
              <TextField
                className={classes.textField}
                id="adjustDescription"
                label="Description"
                margin="dense"
                multiline
                name="description"
                onChange={e => handleFieldChange(e, 'description')}
                value={state.adjustDescription}
              />
              <FormHelperText id="description-helper-text">
                {' '}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={7}>
            <SaveButton
              submitHandler={handleSubmit}
              label="Save Adjustment"
            />
          </Grid>

          <Grid item xs={5}>
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
ShiftAdjustDialog.propTypes = {
  field: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  shift: PropTypes.instanceOf(Object).isRequired,
  type: PropTypes.string.isRequired,
}
ShiftAdjustDialog.defaultProps = {
  field: null,
}

export default ShiftAdjustDialog
