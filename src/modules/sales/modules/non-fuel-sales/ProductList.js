import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@material-ui/core'

import UpdateIcon from '@material-ui/icons/Update'
import { makeStyles } from '@material-ui/core/styles'

import { fmtNumber } from '../../../../utils/fmt'
import ProductAdjustDialog from './ProductAdjustDialog'

// const R = require('ramda')

const useStyles = makeStyles(theme => ({
  iconButton: {
    padding: 4,
  },
  iconCell: {
    width: theme.spacing(4),
  },
  root: {
    width: '100%',
  },
  title: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
}))

const DialogButton = ({ openHandler }) => {
  const classes = useStyles()

  return (
    <IconButton
      className={classes.iconButton}
      onClick={() => openHandler()}
    >
      <Tooltip title="Adjust Product" placement="left">
        <UpdateIcon />
      </Tooltip>
    </IconButton>
  )
}
DialogButton.propTypes = {
  openHandler: PropTypes.func.isRequired,
}

const ProductList = () => {
  const classes = useStyles()
  const [openAdjust, setOpenAdjust] = useState(false)
  const [productValues, setProductValues] = useState({})
  const [selectedRecord, setSelectedRecord] = useState({})
  const sales = useSelector(state => state.sales)
  const shiftID = sales.shift.sales.result.shift.id

  useEffect(() => {
    setProductValues(sales.shift.sales.entities.nonFuelSale)
  }, [sales])

  const handleOpenAdjust = () => {
    setOpenAdjust(true)
  }

  const handleCloseAdjust = () => {
    setOpenAdjust(false)
  }

  return (
    <Paper className={classes.root} square>
      <Typography variant="h6" className={classes.title}>
        Products
      </Typography>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="center">Open</TableCell>
            <TableCell align="center">Restock</TableCell>
            <TableCell align="center">Sold</TableCell>
            <TableCell align="center">Close</TableCell>
            <TableCell align="right">Sales</TableCell>
            <TableCell align="center" />
          </TableRow>
        </TableHead>

        <TableBody>
          {Object.values(productValues).map(nfs => (
            <TableRow key={nfs.id}>
              <TableCell>{nfs.productID.name}</TableCell>
              <TableCell align="center">{nfs.qty.open}</TableCell>
              <TableCell align="center">{nfs.qty.restock}</TableCell>
              <TableCell align="center">{nfs.qty.sold}</TableCell>
              <TableCell align="center">{nfs.qty.close}</TableCell>
              <TableCell align="right">{fmtNumber(nfs.sales)}</TableCell>
              <TableCell align="center" onClick={() => setSelectedRecord(productValues[nfs.id])} padding="none">
                <DialogButton openHandler={handleOpenAdjust} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ProductAdjustDialog
        onClose={handleCloseAdjust}
        open={openAdjust}
        selectedRecord={selectedRecord}
        shiftID={shiftID}
      />
    </Paper>
  )
}

export default ProductList
