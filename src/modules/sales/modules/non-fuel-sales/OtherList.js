import React from 'react'

import Paper from '@material-ui/core/Paper'
// import Table from '@material-ui/core/Table'
// import TableBody from '@material-ui/core/TableBody'
// import TableCell from '@material-ui/core/TableCell'
// import TableHead from '@material-ui/core/TableHead'
// import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({ // eslint-disable-line no-unused-vars
  root: {
    width: '100%',
  },
  title: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
}))

export default function OtherList() {
  const classes = useStyles()

  return (
    <Paper className={classes.root} square>
      <Typography variant="h6" className={classes.title}>
        Other Products
      </Typography>
    </Paper>
  )
}
