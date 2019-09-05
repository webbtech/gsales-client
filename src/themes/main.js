// import Colors from 'material-ui/styles/colors';
import {
  cyan,
  grey,
  red,
} from '@material-ui/core/colors'

import { createMuiTheme } from '@material-ui/core/styles'

const mainTheme = createMuiTheme({
  fontFamily: 'Roboto, sans-serif',
  typography: {
    // fontSize: 14,
  },
  palette: {
    primary: red,
    secondary: grey,
    // primary1Color: red[600],
    // primary2Color: cyan[700],
    // primary3Color: grey[700],
    // accent1Color: grey[800],
    // accent2Color: grey[100],
    accent3: grey[500],
    textColor: grey[900],
    alternateTextColor: grey[50],
    canvasColor: grey[50],
    borderColor: grey[300],
    // disabledColor: ColorManipulator.fade(darkBlack, 0.3),
    pickerHeaderColor: cyan[500],
  },
  status: {
    danger: 'orange',
  },
  overrides: {
    MuiTableCell: {
      root: {
        fontSize: '.95rem',
      },
      head: {
        fontSize: '.85rem',
      },
    },
  },
})

export default mainTheme
