import {
  action,
  createRequestTypes,
} from '../../../../utils/actions'

export const STATION = createRequestTypes('STATION')
export const STATIONS = createRequestTypes('STATIONS')
export const STATION_PERSIST = createRequestTypes('STATION_PERSIST')
export const STATION_DISPENSERS = createRequestTypes('STATION_DISPENSERS')

export const stationEntity = {
  request: station => action(STATION.REQUEST, { station }),
  success: response => action(STATION.SUCCESS, { response }),
  failure: error => action(STATION.FAILURE, { error }),
}

export const stationsEntity = {
  request: stations => action(STATIONS.REQUEST, { stations }),
  success: response => action(STATIONS.SUCCESS, { response }),
  failure: error => action(STATIONS.FAILURE, { error }),
}

export const stationDispensersEntity = {
  request: request => action(STATION_DISPENSERS.REQUEST, { request }),
  success: response => action(STATION_DISPENSERS.SUCCESS, { response }),
  failure: error => action(STATION_DISPENSERS.FAILURE, { error }),
}

export const persistStationEntity = {
  request: station => action(STATION_PERSIST.REQUEST, { station }),
  success: response => action(STATION_PERSIST.SUCCESS, { response }),
  failure: error => action(STATION_PERSIST.FAILURE, { error }),
}

export const fetchMonthlyStation = stationID => action(STATION.REQUEST, { stationID })
export const fetchStationDispensers = stationID => action(STATION_DISPENSERS.REQUEST, stationID)
export const fetchStationList = () => action(STATIONS.REQUEST, {})
export const persistStation = params => action(STATION_PERSIST.REQUEST, { params })
