import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import {
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core'

import { useSelector, useDispatch } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles'

import { fetchStationList } from '../admin/modules/station/actions'

const useStyles = makeStyles(theme => ({
  formControl: {
    width: '100%',
  },
  loader: {
    marginTop: theme.spacing(2),
  },
}))

export default function StationSelector(props) {
  const {
    helperText,
    setValueHandler,
    value,
  } = props
  const classes = useStyles()
  const dispatch = useDispatch()
  const station = useSelector(state => state.station)

  const haveStationItems = Object.values(station.items).length

  let stationChildren
  const items = Object.values(station.items)
  if (items.length && !stationChildren) {
    stationChildren = items.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)
  }

  useEffect(() => {
    if (!haveStationItems) {
      dispatch(fetchStationList())
    }
  }, [dispatch, haveStationItems])

  if (station.isFetching) return <div className={classes.loader}>Loading...</div>

  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="station-helper">Station</InputLabel>
      <Select
        className={classes.select}
        input={<Input name="name" id="station-helper" />}
        id="station"
        name="station"
        onChange={e => setValueHandler(e.target.value)}
        value={value}
      >
        {stationChildren}
      </Select>
      {helperText && (
        <FormHelperText id="month-helper-text">
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  )
}
StationSelector.propTypes = {
  helperText: PropTypes.string,
  setValueHandler: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
}
StationSelector.defaultProps = {
  helperText: null,
}
