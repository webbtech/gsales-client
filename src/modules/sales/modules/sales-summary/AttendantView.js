import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
} from '@material-ui/core'

import EditIcon from '@material-ui/icons/Edit'
import { makeStyles } from '@material-ui/core/styles'

import AttendantChangeDialog from './AttendantChangeDialog'
import AttendantCommentsDialog from './AttendantCommentsDialog'
import CheckComplete from '../../../shared/CheckComplete'
import FormatNumber from '../../../shared/FormatNumber'
import SectionTitle from '../../../shared/SectionTitle'

const useStyles = makeStyles(theme => ({
  adjustButton: {
    width: '100%',
  },
  editIcon: {
    marginLeft: theme.spacing(1),
  },
  iconButton: {
    padding: 0,
  },
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(2),
  },
}))

export default function AttendantView() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)
  const [openChangeDialog, setOpenChangeDialog] = useState(false)
  const [openCommentsDialog, setOpenCommentsDialog] = useState(false)

  const handleOpenChangeDialog = () => {
    setOpenChangeDialog(true)
  }

  const handleCloseChangeDialog = () => {
    setOpenChangeDialog(false)
  }

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
      <SectionTitle title="Attendant" />

      <Table className={classes.table} size="small">
        <TableBody>
          <TableRow>
            <TableCell>
              {`${shift.attendant.iD.nameLast}, ${shift.attendant.iD.nameFirst} `}
              {'\u00A0'}
              <IconButton
                className={classes.iconButton}
                onClick={handleOpenChangeDialog}
              >
                <Tooltip title="Edit Attendant" placement="right">
                  <EditIcon />
                </Tooltip>
              </IconButton>
            </TableCell>
            <TableCell />
          </TableRow>

          <TableRow>
            <TableCell>Sheet Completed</TableCell>
            <TableCell align="center" padding="checkbox">
              <CheckComplete value={shift.attendant.sheetComplete} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Overshort Checked</TableCell>
            <TableCell align="center" padding="checkbox">
              <CheckComplete value={shift.attendant.overshortComplete} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Overshort Amount Submitted</TableCell>
            <TableCell align="right">
              <FormatNumber value={shift.attendant.overshortValue} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Button
        className={classes.adjustButton}
        color="secondary"
        onClick={handleOpenCommentsDialog}
        variant="outlined"
      >
        Adjustment Comments
        <EditIcon color="secondary" className={classes.editIcon} />
      </Button>

      <AttendantChangeDialog
        onClose={handleCloseChangeDialog}
        open={openChangeDialog}
        shift={shift}
      />

      <AttendantCommentsDialog
        onClose={handleCloseCommentsDialog}
        open={openCommentsDialog}
        shift={shift}
      />
    </Paper>
  )
}
