import {
  all,
  call,
  takeEvery,
} from 'redux-saga/effects'

import { callApi } from '../../saga/api'
import { Schemas } from '../../services/api'
import * as journalActions from './actions'


// ============================== Fetch Journal ============================== //

export function* fetchJournal({ params: { stationID, recordNum } }) {
  const { fetchJournalEntity } = journalActions
  const endpoint = `journal-report?stationID=${stationID}&recordNum=${recordNum}`

  yield call(callApi, fetchJournalEntity, endpoint, Schemas.DEFAULTS)
}

function* watchJournalFetch() {
  yield takeEvery(journalActions.JOURNAL_ENTRY.REQUEST, fetchJournal)
}

export default function* rootSaga() {
  yield all([
    watchJournalFetch(),
  ])
}
