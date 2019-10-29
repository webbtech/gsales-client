import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import {
  AppBar,
  Button,
  Dialog,
  Fab,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core'

import CloseIcon from '@material-ui/icons/Close'
import SaveIcon from '@material-ui/icons/SaveAlt'
import { makeStyles } from '@material-ui/core/styles'
import { getMiscFieldLabel, getCashCardsFieldLabel } from '../../utils'

import { adjustShiftSummary } from '../../actions'

const R = require('ramda')

const useStyles = makeStyles(theme => ({
  button: {
    width: '100%',
  },
  content: {
    margin: theme.spacing(2),
  },
  formControl: {
    width: '100%',
  },
  numberInput: {
    textAlign: 'right',
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  textField: {
    width: '100%',
  },
  title: {
    flexGrow: 1,
  },
}))

const MiscAdjustDialog = (props) => {
  const {
    field,
    onClose,
    open,
    shift,
    type,
  } = props
  const classes = useStyles()
  const [state, setState] = useState({})
  const dispatch = useDispatch()

  const handleClose = () => {
    onClose()
    setState({})
  }

  const handleFieldChange = (e, f) => {
    setState({ ...state, [f]: e.currentTarget.value })
  }

  const handleSubmit = () => {
    const params = {
      adjustment: {
        field,
        adjustValue: parseFloat(state[field]),
        description: state.description,
      },
      shift,
      recordNum: shift.recordNum,
      stationID: shift.stationID,
    }

    dispatch(adjustShiftSummary(params))
    handleClose()
  }

  const setFieldValue = useCallback(
    (f) => {
      const val = R.path(f.split('.'), shift)
      setState({ ...state, [f]: val })
    },
    [field, shift] // eslint-disable-line
  )

  const getFieldLabelFunc = type === 'misc' ? getMiscFieldLabel : getCashCardsFieldLabel

  useEffect(() => {
    if (field) {
      setFieldValue(field)
    }
  }, [field, setFieldValue])

  if (!field) return null

  const metaField = field.replace('.', ':')
  let calcs = ''

  if (R.hasPath(['meta', 'calculations', metaField], shift)) {
    calcs = shift.meta.calculations[metaField]
  }

  const title = type === 'misc' ? 'Adjust Misc Value' : 'Adjust Cash & Cards Value'

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
    >
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.title}>
            {title}
          </Typography>
          <Fab onClick={handleClose} size="small">
            <CloseIcon />
          </Fab>
        </Toolbar>
      </AppBar>

      <div className={classes.content}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <FormControl className={classes.formControl}>
              <TextField
                autoFocus={!state[field]}
                className={classes.textField}
                id={field}
                inputProps={{
                  className: classes.numberInput,
                }}
                label={getFieldLabelFunc(field)}
                name="value"
                onChange={e => handleFieldChange(e, field)}
                margin="dense"
                type="number"
                value={state[field] || ''}
              />
              <FormHelperText id="field-helper-text">
                {calcs}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={8}>
            <FormControl className={classes.formControl}>
              <TextField
                className={classes.textField}
                id="adjustDescription"
                label="Description"
                margin="dense"
                multiline
                name="description"
                onChange={e => handleFieldChange(e, 'description')}
                value={state.adjustDescription}
              />
              <FormHelperText id="description-helper-text">
                {' '}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={7}>
            <Button
              color="primary"
              className={classes.button}
              onClick={handleSubmit}
              type="submit"
              variant="contained"
            >
              Save Adjustment
              <SaveIcon className={classes.rightIcon} />
            </Button>
          </Grid>

          <Grid item xs={5}>
            <Button
              className={classes.button}
              onClick={handleClose}
              type="button"
              variant="contained"
            >
              Cancel
              <CloseIcon className={classes.rightIcon} />
            </Button>
          </Grid>
        </Grid>
      </div>
    </Dialog>
  )
}
MiscAdjustDialog.propTypes = {
  field: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  shift: PropTypes.instanceOf(Object).isRequired,
  type: PropTypes.string.isRequired,
}
MiscAdjustDialog.defaultProps = {
  field: null,
}

export default MiscAdjustDialog
