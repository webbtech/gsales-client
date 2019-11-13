import React from 'react'
import PropTypes from 'prop-types'

import { Dialog } from '@material-ui/core'

import DetailCash from './DetailCash'
import DetailFuel from './DetailFuel'
import DetailNonFuel from './DetailNonFuel'
import DetailStation from './DetailStation'
import DetailStationSummary from './DetailStationSummary'
import * as ReportTypes from '../../reportTypeConstants'

export default function DetailDialog(props) {
  const {
    onClose,
    open,
    params,
  } = props

  const handleClose = () => {
    onClose()
  }

  const getDialogByType = (type) => {
    switch (type) {
      case ReportTypes.CASH:
        return <DetailCash onClose={onClose} open={open} params={params} />

      case ReportTypes.FUEL:
        return <DetailFuel onClose={onClose} open={open} params={params} />

      case ReportTypes.NON_FUEL:
        return <DetailNonFuel onClose={onClose} open={open} params={params} />

      case ReportTypes.STATION:
        return <DetailStation onClose={onClose} open={open} params={params} />

      case ReportTypes.STATION_SUMMARY:
        return <DetailStationSummary onClose={onClose} open={open} params={params} />

      default:
        return null
    }
  }

  const { type } = params
  if (!type) return null

  return (
    <Dialog onClose={handleClose} open={open}>
      {getDialogByType(type)}
    </Dialog>
  )
}
DetailDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  params: PropTypes.instanceOf(Object).isRequired,
}
