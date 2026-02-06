import { Box, Typography } from '@mui/material'
import React from 'react'

const ActionHelpText = () => {
    return (
        <Box sx={{ p: 1 }}>
            <Typography sx={{ mb: 1 }} variant="body2">Actions indicates that if permission is available, you can do three actions. Like:-</Typography>
            <ul>
                <li>View  (if field type is "select")</li>
                <li>Edit  (if permission allowed)</li>
                <li>Delete (if permission allowed)</li>
            </ul>
            <Typography variant="caption">N.B:- You can do all of those actions with newly added fields.</Typography>
        </Box>
    )
}

export default ActionHelpText