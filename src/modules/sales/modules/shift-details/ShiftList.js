import React, {
  useCallback,
  useEffect,
  useContext,
  useState,
} from 'react'
import PropTypes from 'prop-types'

import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'

import moment from 'moment'

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'

import LockIcon from '@material-ui/icons/Lock'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import { makeStyles } from '@material-ui/core/styles'

import SectionTitle from '../../../shared/SectionTitle'
import { loadShift } from '../../actions'
import { ParamContext } from '../../components/ParamContext'

const R = require('ramda')

const useStyles = makeStyles(theme => ({
  activeShift: {
    backgroundColor: theme.palette.grey[50],
  },
  root: {
    flexGrow: 1,
  },
  table: {
    minWidth: 200,
  },
}))

function ShiftList({ dayID, history, match }) {
  const classes = useStyles()
  const [selected, setSelected] = useState(null)
  const sales = useSelector(state => state.sales)
  const dispatch = useDispatch()
  const { shiftParams, setShiftParams } = useContext(ParamContext)

  let shifts = []
  if (R.hasPath(['shifts', 'entities', 'shifts'], sales)) {
    shifts = Object.values(sales.shifts.entities.shifts)
  }

  const setShiftNo = useCallback(
    () => {
      let shift
      if (!selected && match.params.shift) {
        shift = Number(match.params.shift)
        setSelected(shift)
      } else if (selected && !match.params.shift) {
        shift = null
        setSelected(null)
      }
    },
    [match.params.shift, selected],
  )

  function handleRowClick(e, shift) {
    const shiftNo = shift.shift.number
    setShiftParams({ shiftNo })
    const params = {
      shiftID: shift.id,
      stationID: shift.stationID.id,
      recordNum: shift.recordNum,
    }
    dispatch(loadShift(params))

    // At this point it should be safe to assume we have a stationID parameter in our url
    const recordDate = moment(sales.dayInfo.recordDate).format('YYYY-MM-DD')
    const url = `/sales/shift-details/${match.params.stationID}/${recordDate}/${shiftNo}`
    history.push(url)
  }

  useEffect(() => {
    setShiftNo()
  }, [dayID, setShiftNo])

  return (
    <Paper className={classes.root} square>
      <SectionTitle title="Shifts" />

      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Shift</TableCell>
            <TableCell align="center">Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {shifts.map(shift => (
            <TableRow
              key={shift.shift.number}
              hover
              onClick={event => handleRowClick(event, shift)}
              role="checkbox"
              selected={shiftParams.shiftNo === shift.shift.number}
            >
              <TableCell>{shift.shift.number}</TableCell>
              <TableCell align="center" padding="none">
                {shift.shift.flag ? (<LockIcon />) : (<LockOpenIcon color="primary" />)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}
ShiftList.propTypes = {
  dayID: PropTypes.string.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
}

export default withRouter(ShiftList)
