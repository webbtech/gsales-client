import React, { useContext, useEffect, useState } from 'react'

import { Snackbar } from '@material-ui/core'

import SnackBarWrapper from './SnackBarWrapper'
import { ToasterContext } from './ToasterContext'

export default function Toaster() {
  const [openSnack, setOpenSnack] = useState(false)
  const { toaster: { duration, message, variant } } = useContext(ToasterContext)

  const handleOpenSnack = () => {
    setOpenSnack(true)
  }

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnack(false)
  }

  useEffect(() => {
    if (message !== '') {
      handleOpenSnack()
    }
  }, [message])

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      autoHideDuration={duration}
      onClose={handleCloseSnack}
      open={openSnack}
    >
      <SnackBarWrapper
        message={message}
        onClose={handleCloseSnack}
        variant={variant}
      />
    </Snackbar>
  )
}
