import React from 'react'
import { useSelector } from 'react-redux'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import LogoLink from '../../shared/LogoLink'
import MainMenu from '../../shared/MainMenu'

const R = require('ramda')

const useStyles = makeStyles(theme => ({ // eslint-disable-line no-unused-vars
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    textShadow: '1px 1px 1.5px #666666',
  },
}))

export default function TitleBar() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)

  let title = 'Sales Data'
  if (R.hasPath(['dayInfo', 'station'], sales)) {
    title += ` ${String.fromCharCode(183)} ${sales.dayInfo.station.name}`
  }
  if (R.hasPath(['shift', 'sales', 'result', 'shift', 'recordNum'], sales)) {
    title += ` ${String.fromCharCode(183)} ${sales.shift.sales.result.shift.recordNum}`
  }

  return (
    <header className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <LogoLink />
          <Typography variant="h5" className={classes.title}>
            {title}
          </Typography>
          <MainMenu />
        </Toolbar>
      </AppBar>
    </header>
  )
}
