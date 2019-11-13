import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@material-ui/core'

import EditIcon from '@material-ui/icons/Edit'
import { makeStyles } from '@material-ui/core/styles'

import FormatNumber from '../../../shared/FormatNumber'
import OvershortCommentsDialog from './OvershortCommentsDialog'
import SectionTitle from '../../../shared/SectionTitle'
import { NlToBr } from '../../../../utils/utils'

const useStyles = makeStyles(theme => ({
  adjustButton: {
    width: '100%',
  },
  editIcon: {
    marginLeft: theme.spacing(1),
  },
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(2),
  },
}))

export default function OvershortDetailsView() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)
  const [openCommentsDialog, setOpenCommentsDialog] = useState(false)

  const handleOpenCommentsDialog = () => {
    setOpenCommentsDialog(true)
  }

  const handleCloseCommentsDialog = () => {
    setOpenCommentsDialog(false)
  }

  const shift = sales.dayInfo.activeShift
  if (!shift) return null

  return (
    <Paper className={classes.root} square>
      <SectionTitle title="Overshort Details" />

      <Table className={classes.table} size="small">
        <TableBody>
          <TableRow>
            <TableCell>Amount</TableCell>
            <TableCell align="right">
              <FormatNumber value={shift.overshort.amount} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Comments</TableCell>
            <TableCell>{NlToBr(shift.overshort.descrip)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Button
        className={classes.adjustButton}
        color="secondary"
        onClick={handleOpenCommentsDialog}
        variant="outlined"
      >
        Edit Comments
        <EditIcon color="secondary" className={classes.editIcon} />
      </Button>

      <OvershortCommentsDialog
        onClose={handleCloseCommentsDialog}
        open={openCommentsDialog}
        shift={shift}
      />
    </Paper>
  )
}
