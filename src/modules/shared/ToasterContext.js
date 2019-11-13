import React, { createContext, useReducer } from 'react'
import PropTypes from 'prop-types'

const initialState = {
  duration: 6000,
  message: '',
  variant: 'error',
}

const reducer = (toasterParams, newParams) => ({ ...toasterParams, ...newParams })

const ToasterContext = createContext()

function ToasterProvider({ children }) {
  const [toaster, setToaster] = useReducer(reducer, initialState || initialState)

  // console.log('toaster in Provider:', toaster)

  return (
    <ToasterContext.Provider value={{ toaster, setToaster }}>
      {children}
    </ToasterContext.Provider>
  )
}
ToasterProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

export { initialState, ToasterContext, ToasterProvider }
