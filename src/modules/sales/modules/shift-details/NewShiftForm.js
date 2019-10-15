import React, { useEffect, useContext, useState } from 'react'
import PropTypes from 'prop-types'

import Autosuggest from 'react-autosuggest'
import IsolatedScroll from 'react-isolated-scroll'
import match from 'autosuggest-highlight/match'
import moment from 'moment'
import parse from 'autosuggest-highlight/parse'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'

import {
  AppBar,
  Button,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'
import ClearIcon from '@material-ui/icons/Clear'

import { ParamContext } from '../../components/ParamContext'
import { createShift } from '../../actions'
import { fetchActiveEmployees } from '../../../admin/modules/employee/actions'

const useStyles = makeStyles(theme => ({
  closeButton: {
    marginRight: -20,
  },
  formControl: {},
  formRow: {
    marginBottom: theme.spacing(2),
  },
  input: {
    width: 275,
  },
  root: {
    width: 320,
  },
  form: {
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  container: {
    position: 'relative',
  },
  scrollBox: {
    maxHeight: 180,
    overflow: 'auto',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
}))

let suggestions = []

function renderInputComponent(inputProps) {
  const {
    classes,
    inputRef = () => { },
    ref,
    ...other
  } = inputProps

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: (node) => {
          ref(node)
          inputRef(node)
        },
        classes: {
          input: classes.input,
        },
      }}
      {...other}
    />
  )
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query)
  const parts = parse(suggestion.label, matches)

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map(part => (
          <span key={part.text} style={{ fontWeight: part.highlight ? 500 : 400 }}>
            {part.text}
          </span>
        ))}
      </div>
    </MenuItem>
  )
}

function getSuggestions(value) {
  const inputValue = value.trim().toLowerCase()
  const inputLength = inputValue.length

  return inputLength === 0
    ? []
    : suggestions
      .filter(suggestion => suggestion.label.slice(0, inputLength).toLowerCase() === inputValue)
}

function getSuggestionValue(suggestion) {
  return suggestion.label
}

const Form = ({ history, onCloseHandler }) => {
  const classes = useStyles()
  const employee = useSelector(state => state.employee)
  const sales = useSelector(state => state.sales)
  const dispatch = useDispatch()
  const { shiftParams, setShiftParams } = useContext(ParamContext)

  const [state, setState] = useState({
    employee: '',
    day: '',
  })

  useEffect(() => {
    dispatch(fetchActiveEmployees())
  }, [dispatch])

  if (!employee.isFetching && employee.items) {
    const es = Object.values(employee.items)
    suggestions = es.map(e => ({ value: e.id, label: `${e.nameLast}, ${e.nameFirst}` }))
  }

  function handleSubmit() {
    const { recordDate, stationID } = shiftParams
    // First clear shiftNo from url
    setShiftParams({ shiftNo: null })
    const url = `/sales/shift-details/${stationID}/${recordDate}`
    history.push(url)

    const employeeID = suggestions.find(s => s.label === state.employee).value
    const params = {
      action: 'create',
      stationID,
      date: state.day,
      employeeID,
    }
    dispatch(createShift(params))
    onCloseHandler()
  }

  const [stateSuggestions, setSuggestions] = React.useState([])

  const handleSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value))
  }

  const handleSuggestionsClearRequested = () => {
    setSuggestions([])
  }

  const handleStateChange = name => (event, { newValue }) => {
    if (name === 'day') {
      setState({
        ...state,
        [name]: event.target.value,
      })
      return
    }
    setState({
      ...state,
      [name]: newValue,
    })
  }

  const autosuggestProps = {
    renderInputComponent,
    suggestions: stateSuggestions,
    onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
    onSuggestionsClearRequested: handleSuggestionsClearRequested,
    getSuggestionValue,
    renderSuggestion,
  }

  if (!sales.dayInfo.recordDate) return null

  const curDate = moment(sales.dayInfo.recordDate)
  const nextDate = moment(sales.dayInfo.recordDate).add(1, 'days')

  const dayVals = [
    {
      value: curDate.format('YYYY-MM-DD'),
      label: `Current ${curDate.format('YYYY-MM-DD')}`,
    },
    {
      value: nextDate.format('YYYY-MM-DD'),
      label: `Next ${nextDate.format('YYYY-MM-DD')}`,
    },
  ]

  return (
    <div className={classes.root}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.title}>
            Create New Shift
          </Typography>
          <IconButton color="inherit" onClick={onCloseHandler} className={classes.closeButton}>
            <ClearIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent className={classes.form}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl className={classes.formControl}>
              <FormLabel component="legend">Select Next Shift Day</FormLabel>
              <RadioGroup name="day" value={state.day} onChange={handleStateChange('day')}>
                {dayVals.map(dv => (
                  <FormControlLabel
                    control={<Radio />}
                    key={dv.value}
                    label={dv.label}
                    value={dv.value}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl className={classes.formControl}>
              <Autosuggest
                {...autosuggestProps}
                inputProps={{
                  classes,
                  id: 'react-autosuggest-simple',
                  label: 'Attendant',
                  placeholder: 'Select an attendant',
                  value: state.employee,
                  onChange: handleStateChange('employee'),
                }}
                theme={{
                  container: classes.container,
                  suggestionsContainerOpen: classes.suggestionsContainerOpen,
                  suggestionsList: classes.suggestionsList,
                  suggestion: classes.suggestion,
                }}
                renderSuggestionsContainer={(options) => {
                  const { ref, ...restContainerProps } = options.containerProps
                  const callRef = (isolatedScroll) => {
                    if (isolatedScroll !== null) {
                      ref(isolatedScroll.component)
                    }
                  }
                  return (
                    <Paper square>
                      <IsolatedScroll
                        ref={callRef}
                        {...restContainerProps}
                        className={classes.scrollBox}
                      >
                        {options.children}
                      </IsolatedScroll>
                    </Paper>
                  )
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={7}>
            <Button
              color="primary"
              onClick={handleSubmit}
              variant="contained"
            >
              Create Shift
            </Button>
          </Grid>

          <Grid item xs={5}>
            <Button
              onClick={onCloseHandler}
              variant="contained"
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </div>
  )
}
Form.propTypes = {
  onCloseHandler: PropTypes.func.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
}

export default withRouter(Form)
