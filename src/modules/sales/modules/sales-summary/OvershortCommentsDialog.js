import React, { useEffect, useState } from 'react'
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
import { patchShiftField } from '../../actions'

const useStyles = makeStyles(theme => ({
  content: {
    margin: theme.spacing(2),
    width: 400,
  },
  textField: {
    width: '100%',
  },
}))

const OvershortCommentsDialog = (props) => {
  const {
    onClose,
    open,
    shift,
  } = props
  const classes = useStyles()
  const [comments, setComments] = useState('')
  const dispatch = useDispatch()

  const handleClose = () => {
    onClose()
    setComments('')
  }

  const handleCommentsChange = (e) => {
    setComments(e.currentTarget.value)
  }

  const handleSubmit = () => {
    const params = {
      field: 'overshort.descrip',
      value: comments,
      recordNum: shift.recordNum,
      shiftID: shift.id,
      stationID: shift.stationID,
    }
    dispatch(patchShiftField(params))
    handleClose()
  }

  useEffect(() => {
    if (open && shift.overshort.descrip) {
      setComments(shift.overshort.descrip)
    }
  }, [open, shift.overshort.descrip])

  return (
    <Dialog
      onClose={handleClose}
      open={open}
    >
      <DialogAppBar
        closeHandler={handleClose}
        title="Edit Overshort Comments"
      />

      <div className={classes.content}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus={!comments}
              className={classes.textField}
              id="comments"
              label="Comments"
              margin="dense"
              multiline
              onChange={handleCommentsChange}
              value={comments}
            />
          </Grid>

          <Grid item xs={7}>
            <SaveButton
              submitHandler={handleSubmit}
              label="Save Comments"
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
OvershortCommentsDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  shift: PropTypes.instanceOf(Object).isRequired,
}

export default OvershortCommentsDialog
