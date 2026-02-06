import { Typography } from '@mui/material'
import React from 'react'

const ManageSessionTypo = ({ typo }) => {
    return (
        <Typography
            className="user-activity-bold"
        >
            {typo}
        </Typography>
    )
}

export default ManageSessionTypo