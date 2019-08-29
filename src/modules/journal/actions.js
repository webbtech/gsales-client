import {
  action,
  createRequestTypes,
} from '../../utils/actions'

export const JOURNAL_ENTRY = createRequestTypes('JOURNAL_ENTRY')

export const persistJournalEntity = {
  request: request => action(JOURNAL_ENTRY.REQUEST, { request }),
  success: response => action(JOURNAL_ENTRY.SUCCESS, { response }),
  failure: error => action(JOURNAL_ENTRY.FAILURE, { error }),
}

export const fetchJournalEntity = {
  request: request => action(JOURNAL_ENTRY.REQUEST, { request }),
  success: response => action(JOURNAL_ENTRY.SUCCESS, { response }),
  failure: error => action(JOURNAL_ENTRY.FAILURE, { error }),
}

export const fetchJournals = params => action(JOURNAL_ENTRY.REQUEST, { params })
