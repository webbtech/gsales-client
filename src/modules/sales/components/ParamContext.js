import React, { useReducer, useEffect } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const initialState = {
  lastDay: false,
  maxDate: null,
  recordDate: null,
  shiftNo: null,
  stationID: '',
  tabName: 'shift-details',
  timeStamp: moment().toISOString(),
}

const storageKeyName = 'shiftParams'

const reducer = (shiftParams, newParams) => {
  if (newParams === null) {
    localStorage.removeItem(storageKeyName)
    return initialState
  }
  return { ...shiftParams, ...newParams }
}

const localState = JSON.parse(localStorage.getItem(storageKeyName))
const ParamContext = React.createContext()

function ParamProvider({ children }) {
  const [shiftParams, setShiftParams] = useReducer(reducer, localState || initialState)

  useEffect(() => {
    localStorage.setItem(storageKeyName, JSON.stringify(shiftParams))
  }, [shiftParams])

  return (
    <ParamContext.Provider value={{ shiftParams, setShiftParams }}>
      {children}
    </ParamContext.Provider>
  )
}
ParamProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

export { initialState, ParamContext, ParamProvider }
