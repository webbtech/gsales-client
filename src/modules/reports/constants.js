import { getEnv } from '../../utils/utils'

export const START_YEAR = 2013

export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const MAX_NUM_RECORDS = 200

// ===================== Report Types ========================================================== //

export const REPORT_ATTENDANT = 'REPORT_ATTENDANT'
export const REPORT_MONTHLY_SALES = 'REPORT_MONTHLY_SALES'
export const REPORT_OIL_PRODUCT_SALES = 'REPORT_OIL_PRODUCT_SALES'
export const REPORT_PRODUCT_SALES = 'REPORT_PRODUCT_SALES'
export const REPORT_PRODUCT_SALES_ADJUSTMENTS = 'REPORT_PRODUCT_SALES_ADJUSTMENTS'
export const REPORT_SHIFTS = 'REPORT_SHIFTS'
export const REPORT_SHIFT_HISTORY = 'REPORT_SHIFT_HISTORY'

// ===================== Download Service ====================================================== //

export const DWNLD_XLS_SERVICE_URL = 'https://xls-reports.gsales.pfapi.io/report'
export const DWNLD_XLS_BACK_CARDS = 'bankcards'
export const DWNLD_XLS_EMPLOYEE_OS = 'employeeos'
export const DWNLD_XLS_FUEL_SALES = 'fuelsales'
export const DWNLD_XLS_PRODUCT_NUMBERS = 'productnumbers'
export const DWNLD_XLS_MONTHLY_SALES = 'monthlysales'
export const DWNLD_XLS_PAY_PERIOD = 'payperiod'

export const getXlsServiceUrl = () => {
  const env = getEnv()
  let url = ''

  switch (env) {
    case 'development':
    case 'stage':
      url = 'https://xls-reports.gsales.pfapi.io/report'
      break
    case 'production':
      url = 'https://xls-reports.gsales.pfapi.io/report'
      break
    default:
      break
  }

  return url
}
