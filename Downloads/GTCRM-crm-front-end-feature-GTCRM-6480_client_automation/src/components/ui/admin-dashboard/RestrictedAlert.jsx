import { Alert } from '@mui/material'
import React from 'react'

export default function RestrictedAlert() {
    return (
        <Alert severity="warning">You are in restricted mode because you are not seeing the current season data. In this mode, you can't perform any action.</Alert>
    )
}
