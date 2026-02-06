import { TextField } from '@mui/material'
import React from 'react'

const ChargePerReleaseField = ({ label, value }) => {

  return (
    <TextField
      required
      readOnly
      sx={{ mt: 3 }}
      fullWidth
      label={label}
      type="number"
      value={value}
      color="info"
    />
  )
}

export default React.memo(ChargePerReleaseField);