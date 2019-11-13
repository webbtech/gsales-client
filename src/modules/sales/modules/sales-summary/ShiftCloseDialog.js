import React from 'react'
import PropTypes from 'prop-types'

import {
  Button,
  Dialog,
  Grid,
  Typography,
} from '@material-ui/core'

import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'

import DialogAppBar from '../../../shared/DialogAppBar'
import CancelButton from '../../../shared/CancelButton'

const useStyles = makeStyles(theme => ({
  button: {
    width: '100%',
  },
  container: {
    maxWidth: 420,
    margin: theme.spacing(2),
  },
}))

export default function ShiftDeleteDialog(props) {
  const {
    handler,
    onClose,
    open,
  } = props
  const classes = useStyles()

  const handleClose = () => {
    onClose()
  }

  const handleConfirm = () => {
    handler()
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogAppBar
        closeHandler={handleClose}
        title="Close Shift Confirmation"
      />

      <div className={classes.container}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1">
              {'Please confirm that you want to close the shift, and that'}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {'Cash & Cards, Attendant and Overshort Details are saved.'}
            </Typography>
          </Grid>

          <Grid item xs={8}>
            <Button
              color="primary"
              className={classes.button}
              onClick={handleConfirm}
              type="button"
              variant="contained"
            >
              Close Shift
              <CloseIcon className={classes.rightIcon} />
            </Button>
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
ShiftDeleteDialog.propTypes = {
  handler: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
}
