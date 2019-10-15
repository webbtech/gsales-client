import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TextField,
  Typography,
  TableRow,
} from '@material-ui/core'

import SaveIcon from '@material-ui/icons/SaveAlt'
import { makeStyles } from '@material-ui/core/styles'

import { fmtNumber } from '../../../../utils/fmt'
import { saveNonFuelProducts } from '../../actions'

const R = require('ramda')

const useStyles = makeStyles(theme => ({ // eslint-disable-line no-unused-vars
  actionButton: {
    width: '100%',
  },
  buttonRow: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  dataCell: {
    width: 60,
  },
  errorTxt: {
    color: 'red',
  },
  inputCell: {
    paddingTop: theme.spacing(2),
    paddingBottom: 0,
    width: 100,
  },
  nameField: {
    width: 260,
  },
  numberInput: {
    textAlign: 'center',
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  root: {
    width: '100%',
  },
  textField: {
    width: 60,
  },
  title: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
  totalsCell: {
    fontWeight: '600',
  },
}))

const InputField = (props) => {
  const {
    cell,
    fieldCounter,
    fieldType,
    navigateFunc,
    nfsID,
    refs,
    row,
    setStateValues,
    stateValues,
  } = props

  const classes = useStyles()
  const nfs = R.clone(stateValues[nfsID])

  function getError() {
    switch (fieldType) {
      case 'restock':
        return nfs.qty.restock ? !(/^\d*$/.test(nfs.qty.restock)) : false

      case 'sold':
        return nfs.qty.sold ? !(/^\d*$/.test(nfs.qty.sold)) : false

      default:
        return false
    }
  }

  function calcValues(e) {
    let { value } = e.currentTarget
    if (!value) {
      value = '0'
    }
    if (getError()) return

    const ret = R.clone(nfs)

    switch (fieldType) {
      case 'restock':
        ret.qty.restock = value
        ret.qty.close = Number(ret.qty.open) + Number(ret.qty.restock)
        break

      case 'sold':
        ret.qty.sold = value
        ret.qty.close = Number(ret.qty.open) + Number(ret.qty.restock) - Number(ret.qty.sold)
        ret.sales = Number(ret.qty.sold) * ret.productID.cost
        break

      default:
        break
    }
    setStateValues({ ...stateValues, [nfsID]: ret })
  }

  function setValue(e) {
    const { value } = e.currentTarget
    switch (fieldType) {
      case 'restock':
        nfs.qty.restock = value
        break

      case 'sold':
        nfs.qty.sold = value
        break

      default:
        break
    }
    setStateValues({ ...stateValues, [nfsID]: nfs })
  }

  function getValue() {
    switch (fieldType) {
      case 'restock':
        return nfs.qty.restock ? nfs.qty.restock : ''

      case 'sold':
        return nfs.qty.sold ? nfs.qty.sold : ''

      default:
        return ''
    }
  }

  const err = getError()

  return (
    <FormControl>
      <TextField
        className={classes.textField}
        error={err}
        id={`${fieldCounter}`}
        inputProps={{
          className: classes.numberInput,
          value: getValue(),
        }}
        inputRef={(ref) => { refs.current[fieldCounter] = ref }}
        onBlur={calcValues}
        onChange={setValue}
        onKeyDown={e => navigateFunc(e, { row, cell })}
        margin="dense"
      />
      <FormHelperText id="component-helper-text" className={classes.errorTxt}>
        {err ? 'Invalid' : ''}
      </FormHelperText>
    </FormControl>
  )
}
InputField.propTypes = {
  cell: PropTypes.number.isRequired,
  fieldCounter: PropTypes.number.isRequired,
  fieldType: PropTypes.string.isRequired,
  navigateFunc: PropTypes.func.isRequired,
  nfsID: PropTypes.string.isRequired,
  refs: PropTypes.instanceOf(Object).isRequired,
  row: PropTypes.number.isRequired,
  setStateValues: PropTypes.func.isRequired,
  stateValues: PropTypes.instanceOf(Object).isRequired,
}

export default function ProductForm() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)
  const refsArray = useRef([])
  const submitButtonEl = useRef(null)
  const [productValues, setProductValues] = useState({})
  const dispatch = useDispatch()

  useEffect(() => {
    setProductValues(sales.shift.sales.entities.nonFuelSale)
  }, [sales])

  function handleNavigate(event, ref) {
    let nextField

    if (event.keyCode === 38) { // up arrow key
      if (ref.cell === 1) { // move to next cell
        if (ref.row === 1) { return }
        nextField = ((ref.row - 1) * 10) + ref.cell + 1
      } else if (ref.cell === 2) { // move next row
        nextField = (ref.row * 10) + 1
      }
      refsArray.current[nextField].focus()
    } else if (event.keyCode === 40) { // down arrow key
      if (ref.cell === 1) { // move to next cell
        nextField = (ref.row * 10) + ref.cell + 1
      } else if (ref.cell === 2) { // move next row
        nextField = ((ref.row + 1) * 10) + 1
      }
      // Short circuit to submit button
      if (nextField > refsArray.current.length) {
        submitButtonEl.current.focus()
        return
      }
      refsArray.current[nextField].focus()
    }
  }

  function handleSubmit() {
    const { shift } = sales.shift.sales.result
    const params = {
      products: productValues,
      recordNum: shift.recordNum,
      shiftID: shift.id,
      stationID: shift.stationID,
    }
    dispatch(saveNonFuelProducts(params))
  }

  let c = 0
  let productTotal = 0
  const productRows = Object.values(productValues).map((nfs) => {
    c += 1
    const rCtr = c * 10 + 1
    const sCtr = c * 10 + 2
    productTotal += nfs.sales

    return (
      <TableRow key={nfs.id}>
        <TableCell size="small" className={classes.nameField}>{nfs.productID.name}</TableCell>
        <TableCell align="center" className={classes.dataCell}>{nfs.qty.open}</TableCell>
        <TableCell align="center" className={classes.inputCell} size="small">
          <InputField
            cell={1}
            fieldCounter={rCtr}
            fieldType="restock"
            nfsID={nfs.id}
            navigateFunc={handleNavigate}
            refs={refsArray}
            row={c}
            setStateValues={setProductValues}
            stateValues={productValues}
          />
        </TableCell>
        <TableCell align="center" className={classes.inputCell} size="small">
          <InputField
            cell={2}
            fieldCounter={sCtr}
            fieldType="sold"
            nfsID={nfs.id}
            navigateFunc={handleNavigate}
            refs={refsArray}
            row={c}
            setStateValues={setProductValues}
            stateValues={productValues}
          />
        </TableCell>
        <TableCell align="center" className={classes.dataCell} size="small">{nfs.qty.close}</TableCell>
        <TableCell align="center" className={classes.dataCell} size="small">{fmtNumber(nfs.sales)}</TableCell>
      </TableRow>
    )
  })

  return (
    <Paper className={classes.root} square>
      <Typography variant="h6" className={classes.title}>
        Products
      </Typography>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell size="small">Product</TableCell>
            <TableCell align="center" size="small">Open</TableCell>
            <TableCell align="center" size="small">Restock</TableCell>
            <TableCell align="center" size="small">Sold</TableCell>
            <TableCell align="center" size="small">Close</TableCell>
            <TableCell align="center" size="small">Sales</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productRows}
          <TableRow>
            <TableCell className={classes.totalsCell}>Total</TableCell>
            <TableCell colSpan={4} />
            <TableCell align="right" className={classes.totalsCell} style={{ paddingRight: 40 }}>{fmtNumber(productTotal)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Grid container spacing={2} className={classes.buttonRow}>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <Button
            className={classes.actionButton}
            color="primary"
            onClick={handleSubmit}
            ref={submitButtonEl}
            type="submit"
            variant="contained"
          >
            Save Products
            <SaveIcon className={classes.rightIcon} />
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}
