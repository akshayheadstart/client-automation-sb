import { Box, Typography } from '@mui/material'
import React from 'react'

const HeadingDetails = ({ title, src, count }) => {
    return (
        <Box>
            <img src={src} alt={title} />
            <Typography variant="h6">{title}</Typography>
            <Typography variant="h3">{count}</Typography>
        </Box>
    )
}

export default HeadingDetails