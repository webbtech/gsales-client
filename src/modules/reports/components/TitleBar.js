import React from 'react'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import LogoLink from '../../shared/LogoLink'
import MainMenu from '../../shared/MainMenu'

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

  return (
    <header className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <LogoLink />
          <Typography variant="h5" className={classes.title}>
            Reports
          </Typography>
          <MainMenu />
        </Toolbar>
      </AppBar>
    </header>
  )
}
