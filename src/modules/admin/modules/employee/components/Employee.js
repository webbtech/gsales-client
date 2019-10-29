import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { useSelector, useDispatch } from 'react-redux'

import {
  AppBar,
  Button,
  Dialog,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Input,
  InputLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import { fetchEmployees, searchEmployees, setCurrentEmployee } from '../actions'
import EmployeeForm from './Form'

const useStyles = makeStyles(theme => ({
  form: {
    marginLeft: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  result: {
    marginLeft: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  root: {
    width: 600,
  },
  searchEle: {
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    width: 260,
  },
  submitButton: {
    height: 40,
    marginTop: 10,
  },
  title: {
    flexGrow: 1,
  },
}))

const List = (props) => {
  const {
    employees,
    fetchAll,
    handleClickOpen,
    searchTerm,
  } = props
  if (!searchTerm && !fetchAll) return null
  if (employees === null) { // If null, no match
    return <div>There are no results for your request. Please try a different search.</div>
  }
  if (Array.isArray(employees)) { // Empty array is prior to actual search
    return null
  }

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Last</TableCell>
          <TableCell>First</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {Object.values(employees).map(e => (
          <TableRow
            key={e.id}
            hover
            onClick={() => handleClickOpen(e.id)}
          >
            <TableCell>{e.nameLast}</TableCell>
            <TableCell>{e.nameFirst}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
List.propTypes = {
  employees: PropTypes.instanceOf(Object),
  fetchAll: PropTypes.bool.isRequired,
  handleClickOpen: PropTypes.func.isRequired,
  searchTerm: PropTypes.string,
}
List.defaultProps = {
  employees: null,
  searchTerm: null,
}

export default function Employee() {
  const classes = useStyles()
  const employees = useSelector(state => state.employee)
  const dispatch = useDispatch()
  const [open, setOpen] = React.useState(false)
  const [fetchAll, setFetchAll] = React.useState(false)
  const [state, setState] = React.useState({
    active: true,
  })

  const handleChange = name => (event) => {
    setState({ ...state, [name]: event.target.checked })
  }

  const handleSearch = (e) => {
    setState({ ...state, search: e.currentTarget.value })
    setFetchAll(false)
  }

  const handleFetchAll = () => {
    setFetchAll(true)
    dispatch(fetchEmployees({ active: state.active }))
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

        <Button
          color="primary"
          className={classes.submitButton}
          onClick={handleFetchAll}
          variant="contained"
        >
          Show All
        </Button>
      </FormGroup>

      <div className={classes.result}>
        {employees.isFetching ? (
          <div>Loading...</div>
        ) : (
          <List
            employees={employees.items}
            fetchAll={fetchAll}
            handleClickOpen={handleClickOpen}
            searchTerm={state.search}
          />
        )}
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
      >
        <EmployeeForm onCloseHandler={handleClose} />
      </Dialog>
    </div>
  )
}
