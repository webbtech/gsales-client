import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { useSelector, useDispatch } from 'react-redux'

import { Dialog } from '@material-ui/core'

import DialogAppBar from '../../../shared/DialogAppBar'
import Loader from '../../../shared/Loader'
import RecordView from './RecordView'
import { fetchShift } from '../../actions'

export default function RecordDialog(props) {
  const {
    onClose,
    open,
    shiftID,
  } = props
  const dispatch = useDispatch()
  const report = useSelector(state => state.report2)

  const handleClose = () => {
    onClose()
  }

  useEffect(() => {
    if (shiftID) {
      dispatch(fetchShift({ shiftID }))
    }
  }, [dispatch, shiftID])

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
      PaperProps={{ style: { maxWidth: 750 } }}
    >
      <DialogAppBar
        closeHandler={handleClose}
        title="Shift Report"
      />

      {report.isFetching && <Loader />}
      {report.report && <RecordView record={report.report.result.result} />}
    </Dialog>
  )
}
RecordDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  shiftID: PropTypes.string.isRequired,
}
