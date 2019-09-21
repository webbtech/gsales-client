import React from 'react'

import Button from '@material-ui/core/Button'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import LockIcon from '@material-ui/icons/Lock'
// import LockOpenIcon from '@material-ui/icons/LockOpen'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  actionButton: {
    marginBottom: theme.spacing(1),
    width: '100%',
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  root: {
    flexGrow: 1,
  },
  title: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
}))

export default function ButtonsView() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Button
        // disabled={pristine || submitting}
        className={classes.actionButton}
        color="secondary"
        type="submit"
        variant="contained"
      >
        Shift Report
        <CloudDownloadIcon className={classes.rightIcon} />
      </Button>
      <Button
        // disabled={pristine || submitting}
        className={classes.actionButton}
        color="secondary"
        type="submit"
        variant="contained"
      >
        Day Report
        <CloudDownloadIcon className={classes.rightIcon} />
      </Button>
      <Button
        // disabled={pristine || submitting}
        disabled
        className={classes.actionButton}
        color="primary"
        type="submit"
        variant="contained"
      >
        Close Shift
        <LockIcon className={classes.rightIcon} />
      </Button>
    </div>
  )
}
