import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import {
  TextField,
  MenuItem,
  Paper,
} from '@material-ui/core'

import Autosuggest from 'react-autosuggest'
import IsolatedScroll from 'react-isolated-scroll'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'

import { makeStyles } from '@material-ui/core/styles'

import { fetchEmployees } from '../admin/modules/employee/actions'

const useStyles = makeStyles(theme => ({
  content: {
    margin: theme.spacing(2),
    width: 375,
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

const Selector = ({ employeeHandler }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [employee, setEmployee] = useState('')
  const employeeState = useSelector(state => state.employee)

  const haveEmployees = !!employeeState.items

  useEffect(() => {
    if (!haveEmployees) {
      dispatch(fetchEmployees())
    }
  }, [dispatch, haveEmployees])

  useEffect(() => {
    if (employee.length > 3) {
      const e = suggestions.find(s => s.label === employee)
      if (e) {
        employeeHandler(e.value)
      }
    }
  }, [employee]) // eslint-disable-line
  // employeeHandle does not work as a dependency for the useEffect above

  if (!employeeState.isFetching && employeeState.items) {
    const es = Object.values(employeeState.items)
    suggestions = es.map(e => ({ value: e.id, label: `${e.nameLast}, ${e.nameFirst}` }))
  }

  const [stateSuggestions, setSuggestions] = useState([])

  const handleSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value))
  }

  const handleSuggestionsClearRequested = () => {
    setSuggestions([])
  }

  const handleEmployeeChange = () => (e, { newValue }) => {
    setEmployee(newValue)
  }

  const autosuggestProps = {
    renderInputComponent,
    suggestions: stateSuggestions,
    onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
    onSuggestionsClearRequested: handleSuggestionsClearRequested,
    getSuggestionValue,
    renderSuggestion,
  }

  return (
    <div className={classes.container}>
      <Autosuggest
        {...autosuggestProps}
        inputProps={{
          autoFocus: true,
          classes,
          id: 'employee',
          label: 'Attendant',
          placeholder: 'Select an attendant',
          value: employee,
          onChange: handleEmployeeChange(),
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
    </div>
  )
}
Selector.propTypes = {
  employeeHandler: PropTypes.func.isRequired,
}

export default Selector
