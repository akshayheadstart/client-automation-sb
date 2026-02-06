import React from 'react'
import { FormHelperText } from "@mui/material"
const WarningMessage = ({ message }) => {
    return (
        <FormHelperText
            sx={{ color: "#ffa117" }}
            variant="body2"
        >
            {message}
        </FormHelperText>
    )
}

export default WarningMessage