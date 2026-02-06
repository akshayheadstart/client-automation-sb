import { Box, Typography } from '@mui/material'
import React from 'react'

const ScoreDetails = ({ title1, title2, score1, score2 }) => {
    return (
        <Box className="interviewed-score-details">
            <Typography variant="caption">
                {title1}<Typography variant="subtitle1">{score1}</Typography>
            </Typography>
            <Typography variant="caption">
                {title2} <Typography variant="subtitle1">{score2}</Typography>
            </Typography>
        </Box>
    )
}

export default ScoreDetails