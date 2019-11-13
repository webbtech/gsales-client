import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  Redirect,
  Route,
  Switch,
  useHistory,
} from 'react-router-dom'

import {
  AppBar,
  Paper,
  Tab,
  Tabs,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import TitleBar from './TitleBar'
import FuelSales from '../modules/fuel-sales/Index'
import NonFuelSales from '../modules/non-fuel-sales/Index'
import SalesSummary from '../modules/sales-summary/Index'
import ShiftDetails from '../modules/shift-details/Index'

import { alertSend } from '../../alert/actions'
import { loadShift, loadShiftSales } from '../actions'
import { ParamContext } from './ParamContext'

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
    recordDate: pathParts[4],
    shift: pathParts[5],
    stationID: pathParts[3],
    tabName: pathParts[2],
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

export default function Index() {
  const classes = useStyles()
  const [tabKey, setTabKey] = useState(0)
  const dispatch = useDispatch()
  const history = useHistory()

  const sales = useSelector(state => state.sales)
  const { shiftParams, setShiftParams } = useContext(ParamContext)

  /**
   * Callback function to set stationID and recordDate each time station is selected
   */
  const setUrlParams = useCallback(
    () => {
      if (sales.isFetching || !shiftParams.recordDate || !shiftParams.stationID) return

      let url = '/sales/shift-details/'
      const { shiftNo, stationID } = getLocationParams()

      if ((shiftParams.stationID && !stationID)
        || (stationID && shiftParams.stationID !== stationID)) {
        url += `${shiftParams.stationID}/${shiftParams.recordDate}`
        history.push(url)
      }

      // If we have a recently created shift
      if (!shiftNo && !shiftParams.shiftNo && R.hasPath(['shift', 'sales', 'result', 'shift', 'shift', 'number'], sales)) {
        const shiftNumber = sales.shift.sales.result.shift.shift.number

        // At this point we should already have the require params in shiftParams
        url += `${shiftParams.stationID}/${shiftParams.recordDate}/${shiftNumber}`
        history.push(url)
        setShiftParams({ shiftNo: shiftNumber })
      }
    },
    [history, sales, setShiftParams, shiftParams]
  )

  /**
   * Callback function to fetch shiftSales after reloading page
   * We're looking at the shiftParams object for required params
   */
  const resetSales = useCallback(
    () => {
      if (sales.isFetching) return
      if (R.hasPath(['dayInfo', 'station', 'id'], sales) || !shiftParams.stationID || !shiftParams.recordDate) return
      const params = {
        date: shiftParams.recordDate,
        populate: true,
      }
      dispatch(loadShiftSales(shiftParams.stationID, params))
    },
    [dispatch, sales, shiftParams],
  )

  /**
   * Callback function to load shiftData
   * Similar to the @resetSales function, this loads shift data after a page reload
   */
  // NOTE: this is causing issues when creating and deleting last shift
  const resetShiftData = useCallback(
    () => {
      if (sales.isFetching) return
      if (
        R.hasPath(['shift', 'sales', 'result', 'shift'], sales)
        || !R.hasPath(['shifts', 'entities', 'shifts'], sales)
        || !shiftParams.shiftNo
      ) return

      const shiftNo = Number(shiftParams.shiftNo)
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
    [dispatch, sales, shiftParams],
  )

  /**
   * Callback function to reset proper tab
   * After a page reload the tab resets to default value.
   * This function reset the tab to the accurate one.
   */
  const resetTab = useCallback(
    () => {
      if (sales.isFetching) return

      const { tabName } = shiftParams
      const tabPath = tabs[tabKey].path.split('/')[2]
      if (tabPath !== tabName) {
        const searchTabPath = `/sales/${tabName}`
        const newVal = R.findIndex(R.propEq('path', searchTabPath))(tabs)
        setTabKey(newVal)
      }
    },
    [sales, shiftParams, tabKey],
  )

  /**
   * Callback to set sales context shiftParams
   */
  const setContextInfo = useCallback(
    () => {
      if (!sales.dayInfo.recordDate || sales.isFetching) return

      const ps = {}
      if (
        (!shiftParams.recordDate && sales.dayInfo.recordDate)
          || (shiftParams.recordDate !== sales.dayInfo.recordDate)
      ) {
        ps.recordDate = sales.dayInfo.recordDate
      }

      // Set maxDate - this is only set once when station is selected - to be persisted
      if (!shiftParams.maxDate && sales.dayInfo.maxDate) {
        ps.maxDate = sales.dayInfo.maxDate
      }

      // Set lastDay
      if (!shiftParams.lastDay && sales.dayInfo.lastDay) {
        ps.lastDay = sales.dayInfo.lastDay
      }

      if (Object.keys(ps).length) {
        setShiftParams(ps)
      }
    },
    [shiftParams, sales, setShiftParams]
  )

  useEffect(() => {
    resetSales()
    setContextInfo()
    setUrlParams()
    resetShiftData()
    resetTab()
  }, [resetSales, resetShiftData, resetTab, setContextInfo, setUrlParams])

  function handleChange(event, newValue) {
    const hasShiftResult = R.hasPath(['shift', 'sales', 'result'], sales)
    if (newValue > 0 && !hasShiftResult) {
      dispatch(alertSend({ message: 'Select both Station and Shift first.', type: 'warning', dismissAfter: 3000 }))
      return
    }
    setTabKey(newValue)
    setShiftParams({ tabName: tabs[newValue].path.split('/')[2] })
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

  // console.log('shiftParams in Index:', shiftParams)

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
              <Route exact path="/sales/sales-summary" component={SalesSummary} />
              <Route exact path="/sales/sales-summary/:stationID/:date/:shift" component={SalesSummary} />
            </Switch>
          </div>
        </Paper>
      </div>
    </div>
  )
}
