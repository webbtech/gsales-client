import React from 'react'
import PropTypes from 'prop-types'

import {
  Button,
  Dialog,
  DialogTitle,
  Grid,
  Typography,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'
import DeleteIcon from '@material-ui/icons/Delete'

const useStyles = makeStyles(theme => ({
  button: {
    width: '100%',
  },
  container: {
    maxWidth: 350,
    margin: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
}))

export default function ShiftDeleteDialog(props) {
  const classes = useStyles()
  const { handler, onClose, open } = props

  function handleClose() {
    onClose()
  }

  function handleConfirm() {
    handler()
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <div className={classes.container}>
        <DialogTitle id="dialog-title">Delete Shift Confirmation</DialogTitle>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>Are you certain you want to delete the last shift?</Typography>
          </Grid>
          <Grid item xs={8}>
            <Button
              color="primary"
              className={classes.button}
              onClick={handleConfirm}
              type="button"
              variant="contained"
            >
              <DeleteIcon className={classes.leftIcon} />
              Delete Last Shift
            </Button>
          </Grid>

          <Grid item xs={4}>
            <Button
              // color="primary"
              className={classes.button}
              onClick={handleClose}
              type="button"
              variant="contained"
            >
              Cancel
            </Button>
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
