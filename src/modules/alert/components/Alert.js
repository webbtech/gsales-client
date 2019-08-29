/* eslint-disable no-underscore-dangle */
import React from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  base: {
    borderRadius: 3,
    boxShadow: '2px 2px 5px rgba(0, 0, 0, .25)',
    boxSizing: 'border-box',
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: '18px',
    marginBottom: 2,
    maxHeight: 400,
    minHeight: 50,
    overflow: 'hidden',
    padding: '1em',
    position: 'relative',
  },
  success: {
    color: '#44662C',
    backgroundColor: '#D7EECE',
  },
  info: {
    color: '#245C7E',
    backgroundColor: '#CAE3F3',
  },
  warning: {
    color: '#5E4922',
    backgroundColor: '#FBF096',
  },
  danger: {
    color: '#6F2526',
    backgroundColor: '#EFD6D6',
  },
}))

const Alert = ({ message, type, onClick }) => {
  const classes = useStyles()

  return (
    <div
      className={classNames(classes.base, classes[type])}
      onClick={onClick}
      onKeyDown={onClick}
      role="button"
      tabIndex="0"
    >
      {message}
    </div>
  )
}

Alert.propTypes = {
  message: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['success', 'info', 'warning', 'danger']).isRequired,
}
Alert.defaultProps = {
  onClick: null,
}

export default Alert
