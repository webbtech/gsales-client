import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import SaveButton from '../../../shared/SaveButton'
import SectionTitle from '../../../shared/SectionTitle'
import FormatNumber from '../../../shared/FormatNumber'
import { patchShift } from '../../actions'

const useStyles = makeStyles(theme => ({
  buttonRow: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  commentsField: {
    width: 280,
  },
  commentsInput: {
    width: 280,
    maxHeight: 75,
  },
  numberInput: {
    textAlign: 'right',
  },
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(2),
  },
  textField: {
    width: 100,
  },
}))

export default function OvershortDetailsForm() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)
  const shift = sales.dayInfo.activeShift
  const [osDescrip, setOsDescrip] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    setOsDescrip(shift.overshort.descrip)
  }, [shift.overshort.descrip])

  function handleSubmit() {
    const params = {
      action: 'patchShift',
      shiftID: shift.id,
      stationID: shift.stationID,
      recordNum: shift.recordNum,
      actionArgs: {
        field: 'overshort.descrip',
        value: osDescrip,
        method: 'simple',
      },
    }
    dispatch(patchShift(params))
  }

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
            <TableCell align="right">
              <TextField
                className={classes.commentsField}
                id="overshort.descrip"
                inputProps={{
                  className: classes.commentsInput,
                }}
                margin="dense"
                multiline
                onChange={e => setOsDescrip(e.currentTarget.value)}
                rows="2"
                rowsMax="4"
                value={osDescrip}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Grid container spacing={2} className={classes.buttonRow} justify="flex-end">
        <Grid item xs={6}>
          <SaveButton
            submitHandler={handleSubmit}
            label="Save Overshort"
          />
        </Grid>
      </Grid>
    </Paper>
  )
}
