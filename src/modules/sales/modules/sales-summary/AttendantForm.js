import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  Checkbox,
  FormControlLabel,
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
import { saveAttendant } from '../../actions'

const useStyles = makeStyles(theme => ({
  actionButton: {
    width: '100%',
  },
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
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(3),
  },
  textField: {
    width: 100,
  },
}))

export default function AttendantForm() {
  const classes = useStyles()
  const [attendantValues, setAttendantValues] = useState({})
  const sales = useSelector(state => state.sales)
  const shift = sales.dayInfo.activeShift
  const dispatch = useDispatch()

  const handleSubmit = () => {
    const attendant = { ...attendantValues }
    delete attendant.iD

    const params = {
      attendant,
      recordNum: shift.recordNum,
      shiftID: shift.id,
      stationID: shift.stationID,
    }
    dispatch(saveAttendant(params))
  }

  const handleCheckboxChange = name => (event) => {
    setAttendantValues({ ...attendantValues, [name]: event.target.checked })
  }
  const handleTextChange = name => (event) => {
    setAttendantValues({ ...attendantValues, [name]: event.currentTarget.value })
  }

  useEffect(() => {
    setAttendantValues(shift.attendant)
  }, [shift])
  if (!shift) return null

  // Perhaps a callback would be better here, problem is checkbox not updating
  // when attendantValues are populated
  const haveAttendant = !!Object.keys(attendantValues).length
  if (!haveAttendant) return null

  return (
    <Paper className={classes.root} square>
      <SectionTitle title="Attendant" />

      <Table className={classes.table} size="small">
        <TableBody>
          <TableRow>
            <TableCell colSpan={2}>
              {`${shift.attendant.iD.nameLast}, ${shift.attendant.iD.nameFirst} `}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell colSpan={2}>
              <FormControlLabel
                control={(
                  <Checkbox
                    checked={attendantValues.sheetComplete}
                    onChange={handleCheckboxChange('sheetComplete')}
                    value="sheetComplete"
                  />
                )}
                label="Sheet Completed"
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell colSpan={2}>
              <FormControlLabel
                control={(
                  <Checkbox
                    checked={attendantValues.overshortComplete}
                    onChange={handleCheckboxChange('overshortComplete')}
                    value="overshortComplete"
                  />
                )}
                label="Over-short Checked"
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Overshort Amount Submitted</TableCell>
            <TableCell align="right">
              <TextField
                className={classes.textField}
                id="overshortValue"
                inputProps={{
                  className: classes.numberInput,
                }}
                margin="dense"
                onChange={handleTextChange('overshortValue')}
                value={attendantValues.overshortValue}
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Adjustment Comments</TableCell>
            <TableCell align="right">
              <TextField
                className={classes.commentsField}
                id="adjustment"
                inputProps={{
                  className: classes.commentsInput,
                }}
                margin="dense"
                multiline
                onChange={handleTextChange('adjustment')}
                rows="2"
                rowsMax="4"
                value={attendantValues.adjustment || ''}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Grid container spacing={2} className={classes.buttonRow} justify="flex-end">
        <Grid item xs={6}>
          <SaveButton
            submitHandler={handleSubmit}
            label="Save Attendant"
          />
        </Grid>
      </Grid>
    </Paper>
  )
}
