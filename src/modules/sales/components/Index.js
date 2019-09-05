import React, { useCallback, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'

import {
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'

import moment from 'moment'

import AppBar from '@material-ui/core/AppBar'
import Paper from '@material-ui/core/Paper'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import { makeStyles } from '@material-ui/core/styles'

import TitleBar from './TitleBar'
import FuelSales from '../modules/fuel-sales/Index'
import NonFuelSales from '../modules/non-fuel-sales/Index'
import SalesSummary from '../modules/sales-summary/Index'
import ShiftDetails from '../modules/shift-details/Index'

import { alertSend } from '../../alert/actions'
import { loadShift, loadShiftSales } from '../actions'

const R = require('ramda')

const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2),
    marginTop: theme.spacing(2.5),
  },
  root: {
    width: '100%',
  },
  tabButton: {
    fontSize: '110%',
  },
  tabContent: {
    padding: theme.spacing(2),
  },
}))

function getLocationParams() {
  const pathParts = window.location.pathname.split('/')
  const params = {
    tabName: pathParts[2],
    stationID: pathParts[3],
    date: pathParts[4],
    shift: pathParts[5],
  }
  return params
}

const tabs = [
  {
    label: 'Shift Details',
    path: '/sales/shift-details',
  },
  {
    label: 'Fuel Sales',
    path: '/sales/fuel-sales',
  },
  {
    label: 'Non-Fuel Sales',
    path: '/sales/non-fuel-sales',
  },
  {
    label: 'Sales Summary',
    path: '/sales/sales-summary',
  },
]

export default function Index({ history }) {
  const classes = useStyles()
  const [tabKey, setTabKey] = useState(0)
  const sales = useSelector(state => state.sales)
  const dispatch = useDispatch()

  /**
   * Callback function to set path params
   * Typically this is called when a station is selected and we want to update params
   * to reflect the change
   */
  const setShiftParams = useCallback(
    () => {
      const { date, tabName, stationID } = getLocationParams()
      const haveParams = !!(stationID && date)
      const haveSalesRecordDate = R.hasPath(['dayInfo', 'recordDate'], sales)
      const haveSalesStationID = R.hasPath(['dayInfo', 'station', 'id'], sales)
      if (!haveParams && tabName === 'shift-details' && haveSalesRecordDate && haveSalesStationID) {
        const recordDate = moment(sales.dayInfo.recordDate).format('YYYY-MM-DD')
        const stnID = sales.dayInfo.station.id
        const url = `/sales/shift-details/${stnID}/${recordDate}`
        history.push(url)
      }
    },
    [history, sales],
  )

  /**
   * Callback function to fetch shiftSales after reloading page
   * Objective with carrying the various params in the url was that we could reload page at will
   * This function reloads the shiftSales after a reload
   */
  const resetSales = useCallback(
    () => {
      if (sales.isFetching === true) return
      if (R.hasPath(['dayInfo', 'station', 'id'], sales)) return
      const { date, stationID } = getLocationParams()
      if (date && stationID) {
        const params = {
          date,
          populate: true,
        }
        dispatch(loadShiftSales(stationID, params))
      }
    },
    [dispatch, sales],
  )

  /**
   * Callback function to load shiftData
   * Similar to the @resetSales function, this loads shift data after a page reload
   */
  const resetShiftData = useCallback(
    () => {
      if (R.hasPath(['shift', 'sales', 'result', 'shift'], sales) || !R.hasPath(['shifts', 'entities', 'shifts'], sales)) return
      let { shift: shiftNo } = getLocationParams()
      shiftNo = Number(shiftNo)
      const shifts = Object.values(sales.shifts.entities.shifts)
      const shift = shifts.find(sh => sh.shift.number === shiftNo)
      if (!shift) return
      const params = {
        shiftID: shift.id,
        stationID: shift.stationID.id,
        recordNum: shift.recordNum,
      }
      dispatch(loadShift(params))
    },
    [dispatch, sales],
  )

  /**
   * Callback function to reset proper tab
   * After a page reload the tab resets to default value.
   * This function reset the tab to the accurate one.
   */
  const resetTab = useCallback(
    () => {
      const { tabName } = getLocationParams()
      const tabPath = tabs[tabKey].path.split('/')[2]
      if (tabPath !== tabName) {
        const searchTabPath = `/sales/${tabName}`
        const newVal = R.findIndex(R.propEq('path', searchTabPath))(tabs)
        setTabKey(newVal)
      }
    },
    [tabKey],
  )

  useEffect(() => {
    setShiftParams(sales)
    resetSales()
    resetShiftData()
    resetTab()
  }, [resetSales, resetShiftData, resetTab, sales, setShiftParams])

  function handleChange(event, newValue) {
    const hasShiftResult = R.hasPath(['shift', 'sales', 'result'], sales)
    if (newValue > 0 && !hasShiftResult) {
      dispatch(alertSend({ message: 'Select both Station and Shift first.', type: 'warning', dismissAfter: 3000 }))
      return
    }
    setTabKey(newValue)
    // If user is selecting the 'shift-details' without selecting the station and shift, allow
    if (newValue === 0 && !hasShiftResult) {
      history.push(`${tabs[newValue].path}`)
      return
    }
    // So now we can imperatively set (and push) route
    const pathParts = window.location.pathname.split('/')
    const stationID = pathParts[3]
    const date = pathParts[4]
    const shift = pathParts[5]
    const url = `${tabs[newValue].path}/${stationID}/${date}/${shift}`
    history.push(url)
  }

  return (
    <div className={classes.root}>
      <TitleBar />
      <div className={classes.container}>
        <Paper className={classes.paper} square>
          <AppBar position="static">
            <Tabs
              onChange={handleChange}
              value={tabKey}
              variant="fullWidth"
            >
              {tabs.map(t => (
                <Tab key={t.path} label={t.label} className={classes.tabButton} />
              ))}
            </Tabs>
          </AppBar>
          <div className={classes.tabContent}>
            <Switch>
              <Redirect exact from="/sales" to="/sales/shift-details" />
              <Route exact path="/sales/shift-details" component={ShiftDetails} />
              <Route exact path="/sales/shift-details/:stationID" component={ShiftDetails} />
              <Route exact path="/sales/shift-details/:stationID/:date" component={ShiftDetails} />
              <Route exact path="/sales/shift-details/:stationID/:date/:shift" component={ShiftDetails} />
              <Route path="/sales/fuel-sales" component={FuelSales} />
              <Route path="/sales/non-fuel-sales" component={NonFuelSales} />
              <Route path="/sales/sales-summary" component={SalesSummary} />
            </Switch>
          </div>
        </Paper>
      </div>
    </div>
  )
}
Index.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
}
