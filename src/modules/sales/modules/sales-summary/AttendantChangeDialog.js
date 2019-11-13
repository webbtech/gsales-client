import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import {
  Dialog,
  Grid,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import AttendantSelector from '../../../shared/AttendantSelector'
import CancelButton from '../../../shared/CancelButton'
import DialogAppBar from '../../../shared/DialogAppBar'
import SaveButton from '../../../shared/SaveButton'
import { patchShiftField } from '../../actions'

const useStyles = makeStyles(theme => ({
  content: {
    margin: theme.spacing(2),
    width: 375,
  },
  textField: {
    width: '100%',
  },
}))

const AttendantChangeDialog = (props) => {
  const {
    onClose,
    open,
    shift,
  } = props
  const classes = useStyles()
  const [employeeID, setEmployeeID] = useState('')
  const dispatch = useDispatch()

  const handleClose = () => {
    onClose()
    setEmployeeID('')
  }

  const handleSubmit = () => {
    const params = {
      field: 'attendant.ID',
      value: employeeID,
      recordNum: shift.recordNum,
      shiftID: shift.id,
      stationID: shift.stationID,
    }
    dispatch(patchShiftField(params))
    handleClose()
  }

  const handleSetEmployee = (ID) => {
    setEmployeeID(ID)
  }

  return (
    <Dialog
      onClose={handleClose}
      open={open}
    >
      <DialogAppBar
        closeHandler={handleClose}
        title="Change Shift Attendant"
      />

      <div className={classes.content}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AttendantSelector employeeHandler={handleSetEmployee} />
          </Grid>

          <Grid item xs={8}>
            <SaveButton
              submitHandler={handleSubmit}
              label="Save Attendant"
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
AttendantChangeDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  shift: PropTypes.instanceOf(Object).isRequired,
}

export default AttendantChangeDialog
