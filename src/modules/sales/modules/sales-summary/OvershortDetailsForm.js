import React from 'react'
import { useSelector } from 'react-redux'

import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  // Tooltip,
  Typography,
} from '@material-ui/core'

import SaveIcon from '@material-ui/icons/SaveAlt'
import { makeStyles } from '@material-ui/core/styles'

// import { fmtNumber } from '../../../../utils/fmt'
import FormatNumber from '../../../shared/FormatNumber'

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
    marginBottom: theme.spacing(2),
  },
  textField: {
    width: 100,
  },
  title: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
}))

export default function OvershortDetailsForm() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)
  const shift = sales.dayInfo.activeShift
  console.log('shift:', shift)

  return (
    <Paper className={classes.root} square>
      <Typography variant="h6" className={classes.title}>
        Overshort Details
      </Typography>

      <Table className={classes.table} size="small">
        <TableBody>
          <TableRow>
            <TableCell>Amount</TableCell>
            <TableCell align="right">
              <FormatNumber value={shift.overshort.amount} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell align="right">
              <TextField
                // autoComplete="off"
                // defaultValue={fmtNumber(defaultValue)}
                className={classes.commentsField}
                // id={field}
                inputProps={{
                  className: classes.commentsInput,
                }}
                multiline
                rows="2"
                rowsMax="4"
                // inputRef={(ref) => { refs.current[field] = ref }}
                margin="dense"
              // onBlur={handleBlur}
              // onKeyDown={e => navigateFunc(e, field)}
              // onFocus={handleFocus}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Grid container spacing={2} className={classes.buttonRow}>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <Button
            className={classes.actionButton}
            color="primary"
            // onClick={handleSubmit}
            // ref={submitButtonEl}
            type="submit"
            variant="contained"
          >
            Save Overshort Details
            <SaveIcon className={classes.rightIcon} />
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}
