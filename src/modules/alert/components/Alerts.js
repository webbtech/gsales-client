import React from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { makeStyles } from '@material-ui/core/styles'

import { alertDismiss } from '../actions'
import Alert from './Alert'

const getter = (obj, propName) => (obj.get ? obj.get(propName) : obj[propName])

const useStyles = makeStyles(theme => ({
  root: {
    left: 0,
    marginLeft: 210,
    marginRight: theme.spacing(),
    position: 'fixed',
    right: 0,
    textAlign: 'left',
    top: 75,
    width: 'calc(100vw - 230)',
    zIndex: 1200,
  },
  enter: {
    opacity: 0.01,
  },
  enterActive: {
    opacity: 1,
    transition: 'opacity 500ms ease-in',
  },
  exit: {
    opacity: 1,
  },
  exitActive: {
    opacity: 0.01,
    transition: 'opacity 300ms ease-in',
  },
  appear: {
    opacity: 0.01,
  },
  appearActive: {
    opacity: 1,
    transition: 'opacity .5s ease-in',
  },
}))

const Alerts = () => {
  const alerts = useSelector(state => state.alerts)
  const dispatch = useDispatch()
  const classes = useStyles()

  const items = alerts.length && alerts.map((alert) => {
    if (!alert.id) {
      alert.id = new Date().getTime() // eslint-disable-line no-param-reassign
    }

    return (
      <CSSTransition
        key={alert.id}
        timeout={{ enter: 200, exit: 300 }}
        classNames={{
          appear: classes.appear,
          appearActive: classes.appearActive,
          enter: classes.enter,
          enterActive: classes.enterActive,
          exit: classes.exit,
          exitActive: classes.exitActive,
        }}
      >
        <Alert
          message={getter(alert, 'message')}
          type={getter(alert, 'type')}
          onClick={() => dispatch(alertDismiss(alert.id))}
        />
      </CSSTransition>
    )
  })

  return (
    <div className={classes.root}>
      <TransitionGroup>
        {items}
      </TransitionGroup>
    </div>
  )
}

export default Alerts
