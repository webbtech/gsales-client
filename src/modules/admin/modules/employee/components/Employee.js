import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { useSelector, useDispatch } from 'react-redux'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormHelperText from '@material-ui/core/FormHelperText'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Switch from '@material-ui/core/Switch'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { searchEmployees, setCurrentEmployee } from '../actions'
import EmployeeForm from './Form'

const useStyles = makeStyles(theme => ({ // eslint-disable-line no-unused-vars
  form: {
    marginLeft: 20,
    marginTop: 20,
  },
  result: {
    marginTop: 25,
    marginLeft: 20,
  },
  root: {
    width: 500,
  },
  searchEle: {
    marginLeft: 50,
  },
  title: {
    flexGrow: 1,
  },
}))

const List = ({ employees, handleClickOpen }) => {
  // If null, no match
  if (employees === null) {
    return <div>There are no results for your request. Please try a different search.</div>
  }
  // Empty array is prior to actual search
  if (Array.isArray(employees)) {
    return <div />
  }

  return (
    <div className="tbl" style={{ width: '100%' }}>
      <div className="tbl-head">
        <div className="tbl-col text-left">Last</div>
        <div className="tbl-col text-left">First</div>
      </div>
      {Object.values(employees).map(e => (
        <div
          className="tbl-row as-link"
          key={e.id}
          onClick={() => handleClickOpen(e.id)}
          onKeyDown={handleClickOpen}
          role="button"
          tabIndex="0"
        >
          <div className="tbl-cell no-wrap">{e.nameLast}</div>
          <div className="tbl-cell no-wrap">{e.nameFirst}</div>
        </div>
      ))}
    </div>
  )
}
List.propTypes = {
  employees: PropTypes.instanceOf(Object),
  handleClickOpen: PropTypes.func.isRequired,
}
List.defaultProps = {
  employees: null,
}

export default function Employee() {
  const classes = useStyles()
  const employees = useSelector(state => state.employee)
  const dispatch = useDispatch()
  const [open, setOpen] = React.useState(false)
  const [state, setState] = React.useState({
    active: true,
  })

  const handleChange = name => (event) => {
    setState({ ...state, [name]: event.target.checked })
  }

  const handleSearch = (e) => {
    setState({ ...state, search: e.currentTarget.value })
  }

  function handleClickOpen(id) {
    let employeeID = null
    if (typeof id === 'string') {
      employeeID = id
    }
    dispatch(setCurrentEmployee(employeeID))
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  useEffect(() => {
    const searchParams = {
      active: state.active,
      search: state.search,
    }
    if (state.search) {
      dispatch(searchEmployees(searchParams))
    }
  }, [dispatch, state, state.active, state.search])


  return (
    <div className={classes.root}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.title}>
            Employee Search
          </Typography>
          <Button color="inherit" onClick={handleClickOpen}>Add Employee</Button>
        </Toolbar>
      </AppBar>
      <FormGroup row className={classes.form}>
        <FormControlLabel
          control={(
            <Switch
              checked={state.active}
              onChange={handleChange('active')}
              value="active"
              color="primary"
            />
          )}
          label="Active"
        />

        <FormControl className={classes.searchEle}>
          <InputLabel htmlFor="search-text">Search</InputLabel>
          <Input
            autoFocus
            id="search-text"
            onChange={handleSearch}
            aria-describedby="search-text-text"
          />
          <FormHelperText id="search-text-text">
            Enter the first letter(s) of employee last name
          </FormHelperText>
        </FormControl>
      </FormGroup>

      <div className={classes.result}>
        {employees.isFetching ? (
          <div>Loading...</div>
        ) : (
          <List employees={employees.items} handleClickOpen={handleClickOpen} />
        )}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="lg"
      >
        <EmployeeForm onCloseHandler={handleClose} />
      </Dialog>
    </div>
  )
}
