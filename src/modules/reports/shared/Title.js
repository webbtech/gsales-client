import React from 'react'
import PropTypes from 'prop-types'

import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
    paddingLeft: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
}))

const Title = ({ children }) => {
  const classes = useStyles()

  return (
    <Typography variant="h5" className={classes.title}>
      {children}
    </Typography>
  )
}
Title.propTypes = {
  children: PropTypes.string.isRequired,
}

export default Title
