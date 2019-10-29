import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import {
  AppBar,
  Button,
  Dialog,
  DialogContent,
  Fab,
  FormControl,
  FormHelperText,
  Grid,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core'

import CloseIcon from '@material-ui/icons/Close'
import SaveIcon from '@material-ui/icons/SaveAlt'
import { makeStyles } from '@material-ui/core/styles'

import { fmtNumber } from '../../../../utils/fmt'
import { adjustFuelSale } from '../../actions'

const useStyles = makeStyles(theme => ({
  button: {
    width: '100%',
  },
  content: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    width: 500,
  },
  descriptionField: {
    width: '100%',
  },
  errorTxt: {
    color: 'red',
  },
  numberInput: {
    textAlign: 'right',
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  table: {
    marginBottom: theme.spacing(2),
  },
  textField: {
    width: 160,
  },
  title: {
    flexGrow: 1,
  },
}))

const reqFields = ['dollarAdjust', 'litreAdjust']

export default function FuelSaleAdjustDialog(props) {
  const {
    onClose,
    open,
    selectedRecord,
    shiftID,
  } = props
  const classes = useStyles()
  const [state, setState] = useState({})
  const [errors, setError] = useState({})
  const dispatch = useDispatch()

  const handleCheckError = (e, field) => {
    const { value } = e.currentTarget
    if (Number(value) <= 0) {
      setError(err => ({ ...err, [field]: true }))
    }
  }

  const handleClose = () => {
    onClose()
    setError({})
    setState({})
  }

  const handleSetValue = (e, key) => {
    // Clear any previous errors
    if (errors[key]) {
      setError(err => ({ ...err, [key]: false }))
    }
    const { value } = e.currentTarget
    setState({ ...state, [key]: value })
  }

  const handleSubmit = () => {
    reqFields.forEach((f) => {
      if (Number(state[f]) <= 0) {
        setError(err => ({ ...err, [f]: true }))
      }
    })

    if (Object.values(errors).filter(err => err).length) return

    const params = {
      dispenserID: selectedRecord.dispenserID.id,
      recordNum: selectedRecord.recordNum,
      shiftID,
      stationID: selectedRecord.stationID,
      type: 'fuelSale',
      values: {
        description: state.description,
        dollars: {
          open: selectedRecord.dollars.open,
          adjust: parseFloat(state.dollarAdjust),
        },
        litres: {
          open: selectedRecord.litres.open,
          adjust: parseFloat(state.litreAdjust),
        },
      },
    }

    // console.log('params:', params)
    dispatch(adjustFuelSale(params))
    handleClose()
  }

  useEffect(() => (
    () => {
      setError({})
      setState({})
    }
  ), [])

  if (!selectedRecord.dollars) return null
  const { dollars, litres } = selectedRecord

  return (
    <Dialog onClose={handleClose} open={open}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.title}>
            Adjust Fuel Sale Record
          </Typography>
          <Fab onClick={handleClose} size="small">
            <CloseIcon />
          </Fab>
        </Toolbar>
      </AppBar>

      <DialogContent className={classes.content}>
        <Table size="small" className={classes.table}>
          <TableBody>
            <TableRow>
              <TableCell>
                {`Open Dollar: ${fmtNumber(dollars.open)}`}
              </TableCell>
              <TableCell>
                {`Open Litre: ${fmtNumber(litres.open, 3)}`}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <FormControl>
                  <TextField
                    autoFocus
                    className={classes.textField}
                    error={errors.dollarAdjust}
                    id="dollarAdjust"
                    inputProps={{
                      className: classes.numberInput,
                    }}
                    onBlur={e => handleCheckError(e, 'dollarAdjust')}
                    onChange={e => handleSetValue(e, 'dollarAdjust')}
                    label="Dollar Adjust"
                    margin="dense"
                    required
                    type="number"
                    value={state.dollarAdjust}
                  />
                  <FormHelperText className={classes.errorTxt}>
                    {errors.dollarAdjust && <span>Required field</span>}
                  </FormHelperText>
                </FormControl>
              </TableCell>

              <TableCell>
                <FormControl>
                  <TextField
                    className={classes.textField}
                    error={errors.litreAdjust}
                    id="litreAdjust"
                    inputProps={{
                      className: classes.numberInput,
                    }}
                    onBlur={e => handleCheckError(e, 'litreAdjust')}
                    onChange={e => handleSetValue(e, 'litreAdjust')}
                    label="Litre Adjust"
                    margin="dense"
                    required
                    type="number"
                    value={state.litreAdjust}
                  />
                  <FormHelperText className={classes.errorTxt}>
                    {errors.litreAdjust && <span>Required field</span>}
                  </FormHelperText>
                </FormControl>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={2}>
                <TextField
                  className={classes.descriptionField}
                  id="description"
                  onChange={e => handleSetValue(e, 'description')}
                  label="Description"
                  margin="dense"
                  rowsMax="2"
                  multiline
                  value={state.description}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Grid container spacing={2}>
          <Grid item xs={7}>
            <Button
              color="primary"
              className={classes.button}
              onClick={handleSubmit}
              type="submit"
              variant="contained"
            >
              Save Adjustment
              <SaveIcon className={classes.rightIcon} />
            </Button>
          </Grid>

          <Grid item xs={5}>
            <Button
              className={classes.button}
              onClick={handleClose}
              type="button"
              variant="contained"
            >
              Cancel
              <CloseIcon className={classes.rightIcon} />
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}
FuelSaleAdjustDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedRecord: PropTypes.instanceOf(Object).isRequired,
  shiftID: PropTypes.string.isRequired,
}
