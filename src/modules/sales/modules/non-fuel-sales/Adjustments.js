import React from 'react'
import { useSelector } from 'react-redux'

import {
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid,
  Paper,
} from '@material-ui/core'

import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { makeStyles } from '@material-ui/core/styles'

import SectionTitle from '../../../shared/SectionTitle'

const R = require('ramda')

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  gridHeader: {
    paddingLeft: 25,
  },
  headerField: {
    fontWeight: '600',
  },
})

export default function Adjustments() {
  const classes = useStyles()
  const journal = useSelector(state => state.journal)

  if (!R.hasPath(['response', 'entities'], journal)) return null

  let jRecords = []
  const { records } = journal.response.entities
  if (records) {
    const recordVals = Object.values(records)
    jRecords = recordVals.filter(jr => (jr.type === 'nonFuelSaleAdjust' && jr.values.close))
  }

  return (
    <Paper className={classes.root} square>
      <SectionTitle title="Adjustments" />

      <Grid container spacing={1} className={classes.gridHeader}>
        <Grid item xs={3} className={classes.headerField}>Product</Grid>
        <Grid item xs className={classes.headerField}>Type</Grid>
        <Grid item xs className={classes.headerField}>Adjust Value</Grid>
        <Grid item xs={4} className={classes.headerField} />
      </Grid>

      {jRecords.map(jr => (
        <ExpansionPanel key={jr.id}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Grid container spacing={0}>
              <Grid item xs={4}>{jr.values.adjustAttend.productName}</Grid>
              <Grid item xs>{jr.values.type}</Grid>
              <Grid item xs>{jr.values.adjust}</Grid>
              <Grid item xs />
            </Grid>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {jr.quantities ? (
              <Grid container spacing={1}>
                <Grid item xs>pre adjust</Grid>
                <Grid item xs>{`open: ${jr.quantities.original.open}`}</Grid>
                <Grid item xs>{`restock: ${jr.quantities.original.restock}`}</Grid>
                <Grid item xs>{`sold: ${jr.quantities.original.sold}`}</Grid>
                <Grid item xs>{`close: ${jr.quantities.original.close}`}</Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs>post adjust</Grid>
                <Grid item xs>{`open: ${jr.quantities.adjusted.open}`}</Grid>
                <Grid item xs>{`restock: ${jr.quantities.adjusted.restock}`}</Grid>
                <Grid item xs>{`sold: ${jr.quantities.adjusted.sold}`}</Grid>
                <Grid item xs>{`close: ${jr.quantities.adjusted.close}`}</Grid>
              </Grid>
            ) : (
              <Typography>No details</Typography>
            )}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </Paper>
  )
}
