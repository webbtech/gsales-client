import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import alerts from './modules/alert/reducers'
import config from './modules/admin/modules/config/reducers'
import employee from './modules/admin/modules/employee/reducers'
import journal from './modules/journal/reducers'
import product from './modules/admin/modules/product/reducers'
import sales from './modules/sales/reducers'
import { monthlyReport, report, report2 } from './modules/reports/reducers'
import { dispensers, station } from './modules/admin/modules/station/reducers'

export default combineReducers({
  form: formReducer,
  alerts,
  config,
  dispensers,
  employee,
  journal,
  product,
  report,
  monthlyReport,
  sales,
  report2,
  station,
})
