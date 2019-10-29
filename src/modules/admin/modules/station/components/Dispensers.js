import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { Link, withRouter } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import {
  AppBar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@material-ui/core'

import MenuIcon from '@material-ui/icons/ArrowBackIos'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'

import { fetchStation, fetchStationDispensers } from '../actions'
import { fmtNumber } from '../../../../../utils/fmt'

const R = require('ramda')

const useStyles = makeStyles(theme => ({
  root: {
    width: 700,
    marginBottom: theme.spacing(2),
  },
  table: {
    marginTop: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

const List = ({ dispensers }) => {
  if (!Object.keys(dispensers).length) {
    return null
  }
  return Object.values(dispensers).map(d => (
    <TableRow key={d.id}>
      <TableCell>{d.number}</TableCell>
      <TableCell align="center">{d.gradeID}</TableCell>
      <TableCell align="right">{fmtNumber(d.openingDollar)}</TableCell>
      <TableCell align="right">{fmtNumber(d.openingLitre, 3)}</TableCell>
      <TableCell align="center">{moment(d.openingResetDate).format('YYYY-MM-DD')}</TableCell>
    </TableRow>
  ))
}

const Dispensers = ({ match }) => {
  const classes = useStyles()
  const dispensers = useSelector(state => state.dispensers)
  const station = useSelector(state => state.station)
  const dispatch = useDispatch()

  useEffect(() => {
    const { stationID } = match.params
    dispatch(fetchStation(stationID))
    dispatch(fetchStationDispensers({ stationID }))
  }, [dispatch, match.params])

  if (!R.hasPath(['params', 'stationID'], match)) return null
  const stationName = !station.isFetching && station.item ? station.item.name : ''

  return (
    <div className={classes.root}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <IconButton edge="start" component={Link} to="/admin/stations" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.title}>
            {`${stationName} Dispenser List`}
          </Typography>
        </Toolbar>
      </AppBar>

      {station.isFetching || dispensers.isFetching ? (
        <div>Loading...</div>
      ) : (
        <Table size="small" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Number</TableCell>
              <TableCell align="center">Grade</TableCell>
              <TableCell align="right">Opening $</TableCell>
              <TableCell align="right">Opening L</TableCell>
              <TableCell align="center">Opening Set Date</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <List dispensers={dispensers.items} />
          </TableBody>
        </Table>
      )}
    </div>
  )
}
Dispensers.propTypes = {
  match: PropTypes.instanceOf(Object).isRequired,
}

export default withRouter(Dispensers)
