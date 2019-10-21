import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import {
  Button,
  Dialog,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TextField,
  Typography,
} from '@material-ui/core'

import CloseIcon from '@material-ui/icons/Close'
import SaveIcon from '@material-ui/icons/SaveAlt'
import { makeStyles } from '@material-ui/core/styles'

import { fmtNumber } from '../../../../utils/fmt'
import { adjustNonFuelProduct } from '../../actions'

const useStyles = makeStyles(theme => ({
  button: {
    width: '100%',
  },
  container: {
    margin: theme.spacing(2),
  },
  descriptionField: {
    width: '100%',
  },
  errorTxt: {
    color: 'red',
  },
  formCell: {
    width: '20%',
  },
  numberInput: {
    textAlign: 'right',
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  table: {
    marginBottom: theme.spacing(3),
  },
  textField: {
    width: 60,
  },
}))

const ProductAdjustDialog = (props) => {
  const {
    onClose,
    open,
    selectedRecord,
    shiftID,
  } = props
  const classes = useStyles()
  const dispatch = useDispatch()
  const [state, setState] = useState({
    type: '',
    adjustValue: '',
    adjustClose: '',
    adjustSales: '',
    adjustAttendantAmount: '',
    adjustAttendantComments: '',
  })

  const handleClose = () => {
    onClose()
    setState({})
  }

  const handleTypeChange = (e) => {
    setState({ ...state, type: e.target.value })
  }

  const handleValueChange = (e) => {
    const value = Number(e.currentTarget.value)

    if (state.type === 'stock') {
      setState({
        ...state,
        adjustClose: selectedRecord.qty.close + value,
        adjustSales: '',
        adjustSold: '',
        adjustStock: selectedRecord.qty.restock - value,
        adjustValue: value,
      })
    } else if (state.type === 'sold') {
      const close = selectedRecord.qty.close - value
      const sold = selectedRecord.qty.sold + value || 0
      const sales = selectedRecord.productID.cost * sold
      setState({
        ...state,
        adjustClose: close,
        adjustSales: parseFloat(sales),
        adjustSold: sold,
        adjustStock: selectedRecord.qty.restock,
        adjustValue: value,
      })
    }
  }

  const handleFieldChange = (e, field) => {
    setState({ ...state, [field]: e.currentTarget.value })
  }

  const handleSubmit = () => {
    const sold = Number(state.adjustSold) || 0
    const stock = Number(state.adjustStock) || 0
    const description = `${selectedRecord.productID.name} - sold: ${sold}, stock: ${stock}, close: ${state.adjustClose}, sales: ${state.adjustSales}`

    const adjustAttend = {
      amount: state.adjustAttendantAmount || null,
      comments: state.adjustAttendantComments || null,
      productID: selectedRecord.productID.id,
      productName: selectedRecord.productID.name,
    }

    const params = {
      description,
      nonFuelID: selectedRecord.id,
      productID: selectedRecord.productID.id,
      recordNum: selectedRecord.recordNum,
      salesID: shiftID,
      stationID: selectedRecord.stationID,
      type: 'nonFuelSale',
      values: {
        adjust: state.adjustValue || null,
        adjustAttend,
        close: state.adjustClose || null,
        sales: state.adjustSales,
        sold,
        stock: selectedRecord.qty.restock,
        type: state.type || null,
      },
    }

    dispatch(adjustNonFuelProduct(params))
  }

  if (!selectedRecord.qty) return null
  const { qty } = selectedRecord
  const displayAdjustValue = !!state.type

  return (
    <Dialog
      PaperProps={{ style: { maxWidth: 650 } }}
      fullWidth
      onClose={handleClose}
      open={open}
    >
      <div className={classes.container}>
        <DialogTitle id="simple-dialog-title">Adjust Product</DialogTitle>

        <Typography variant="subtitle2">
          Product Info
        </Typography>
        <Divider />
        <Table size="small" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="center">Open</TableCell>
              <TableCell align="center">Restock</TableCell>
              <TableCell align="center">Sold</TableCell>
              <TableCell align="center">Close</TableCell>
              <TableCell align="right">Sales</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell>{selectedRecord.productID.name}</TableCell>
              <TableCell align="center">{qty.open}</TableCell>
              <TableCell align="center">{qty.restock}</TableCell>
              <TableCell align="center">{qty.sold}</TableCell>
              <TableCell align="center">{qty.close}</TableCell>
              <TableCell align="right">{fmtNumber(selectedRecord.sales)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Typography variant="subtitle2">
          Adjustment
        </Typography>
        <Divider />
        <Table size="small" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell align="center">Value</TableCell>
              <TableCell align="center">Close</TableCell>
              <TableCell align="right">Sales</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell className={classes.formCell}>
                <FormControl component="fieldset" className={classes.formControl}>
                  <RadioGroup name="type" value={state.type} onChange={handleTypeChange}>
                    <FormControlLabel value="stock" control={<Radio />} label="Stock" />
                    <FormControlLabel value="sold" control={<Radio />} label="Sold" />
                  </RadioGroup>
                </FormControl>
              </TableCell>

              <TableCell align="center" className={classes.formCell}>
                <TextField
                  className={classes.textField}
                  disabled={!displayAdjustValue}
                  id="adjustValue"
                  inputProps={{
                    className: classes.numberInput,
                  }}
                  onChange={handleValueChange}
                  margin="dense"
                  type="number"
                  value={state.adjustValue}
                />
              </TableCell>

              <TableCell align="center" className={classes.formCell}>
                {state.adjustClose}
              </TableCell>

              <TableCell align="right" className={classes.formCell}>
                {fmtNumber(state.adjustSales)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Typography variant="subtitle2">
          Attendant Details
        </Typography>
        <Divider />
        <Table size="small" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Dollar Value</TableCell>
              <TableCell align="center">Comments</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell>
                <TextField
                  className={classes.textField}
                  id="adjustAttendantAmount"
                  inputProps={{
                    className: classes.numberInput,
                  }}
                  onChange={e => handleFieldChange(e, 'adjustAttendantAmount')}
                  margin="dense"
                  type="number"
                  value={state.adjustAttendantAmount}
                />
              </TableCell>

              <TableCell>
                <TextField
                  className={classes.descriptionField}
                  id="adjustAttendantComments"
                  onChange={e => handleFieldChange(e, 'adjustAttendantComments')}
                  margin="dense"
                  rowsMax="2"
                  multiline
                  value={state.adjustAttendantComments}
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
              Save Product Adjustment
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
      </div>
    </Dialog>
  )
}
ProductAdjustDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedRecord: PropTypes.instanceOf(Object).isRequired,
  shiftID: PropTypes.string.isRequired,
}

export default ProductAdjustDialog
