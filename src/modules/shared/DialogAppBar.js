import React from 'react'
import PropTypes from 'prop-types'

import {
  AppBar,
  Fab,
  Toolbar,
  Typography,
} from '@material-ui/core'

import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
  },
})

export default function DialogAppBar({ closeHandler, title }) {
  const classes = useStyles()

  return (
    <AppBar position="sticky" color="secondary">
      <Toolbar>
        <Typography variant="h6" color="inherit" className={classes.title}>
          {title}
        </Typography>
        <Fab
          color="secondary"
          onClick={closeHandler}
          size="small"
        >
          <CloseIcon />
        </Fab>
      </Toolbar>
    </AppBar>
  )
}
DialogAppBar.propTypes = {
  closeHandler: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}
