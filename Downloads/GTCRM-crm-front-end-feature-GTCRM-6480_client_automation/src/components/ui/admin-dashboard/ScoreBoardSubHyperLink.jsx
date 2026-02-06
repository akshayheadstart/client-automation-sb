import { Typography } from '@mui/material'
import React from 'react'

const ScoreBoardSubHyperLink = ({ value, handleNavigate, permission }) => {
    return (
        <Typography
            onClick={() => permission && handleNavigate()}
            gutterBottom
            variant="caption"
            className="progress-text sub-hyper-link" >
            {value ? value : 0}
        </Typography>
    )
}

export default ScoreBoardSubHyperLink