import React from 'react'
import { useSelector } from 'react-redux'

import EditIcon from '@material-ui/icons/Edit'
import Paper from '@material-ui/core/Paper'
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import FormatNumber from '../../../shared/FormatNumber'

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
  title: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
}))

export default function OvershortDetailsView() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)

  const shift = sales.dayInfo.activeShift
  if (!shift) return null

  return (
    <Paper className={classes.root} square>
      <Typography variant="h6" className={classes.title}>
        Overshort Details
      </Typography>
      <Table className={classes.table} size="small">
        <TableBody>
          <TableRow>
            <TableCell>Amount</TableCell>
            <TableCell>
              <FormatNumber value={shift.overshort.amount} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>{shift.overshort.descrip}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Button
        // disabled={pristine || submitting}
        className={classes.adjustButton}
      >
        Edit Description
        <EditIcon color="secondary" className={classes.editIcon} />
      </Button>
    </Paper>
  )
}
