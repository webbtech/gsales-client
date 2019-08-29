import React from 'react'

import { Link } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

const LogoImg = require('../../images/logo.png')

const useStyles = makeStyles(theme => ({
  logo: {
    height: 55,
    marginRight: theme.spacing(1.5),
  },
}))

export default function LogoLink() {
  const classes = useStyles()

  return (
    <Link to="/">
      <img
        alt="Gales Sales"
        className={classes.logo}
        src={LogoImg}
        style={{ height: '50px' }}
      />
    </Link>
  )
}
