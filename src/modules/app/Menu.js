import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import {
  Button,
  Paper,
  Typography,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import TitleBar from './TitleBar'
import Loader from '../shared/Loader'
import { fetchStationList } from '../admin/modules/station/actions'

const useStyles = makeStyles(theme => ({
  button: {
    width: '100%',
    marginBottom: theme.spacing(0.75),
    marginTop: theme.spacing(0.75),
  },
  loader: {
    marginLeft: 80,
  },
  paper: {
    margin: '60px auto 0',
    padding: '20px',
    textAlign: 'center',
    width: 300,
  },
  root: {
    width: '100%',
  },
}))

export default function Menu() {
  const classes = useStyles()
  const station = useSelector(state => state.station)
  const dispatch = useDispatch()

  const haveStationItems = Object.values(station.items).length

  useEffect(() => {
    if (!haveStationItems) {
      dispatch(fetchStationList())
    }
  }, [dispatch, haveStationItems])

  return (
    <div className={classes.root}>
      <TitleBar />
      <Paper className={classes.paper}>

        {station.isFetching ? (
          <div className={classes.loader}><Loader /></div>
        ) : (
          <>
            <Typography variant="h5" className={classes.title}>
              Select Activity
            </Typography>
            <Button
              className={classes.button}
              color="secondary"
              component={Link}
              label="Sales Data"
              to="/sales"
              variant="contained"
            >
              Sales Data
            </Button>
            <Button
              className={classes.button}
              color="secondary"
              component={Link}
              to="/admin"
              variant="contained"
            >
              Administration
            </Button>
            <Button
              className={classes.button}
              color="secondary"
              component={Link}
              to="/reports"
              variant="contained"
            >
              Reports
            </Button>
          </>
        )}
      </Paper>
    </div>
  )
}
