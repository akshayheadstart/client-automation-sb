import { Box, Divider, Typography } from '@mui/material'
import React from 'react'

const SingleReportFilterDetails = ({ filterName, filterValue }) => {
    return (
        <>
            <Box className="report-filter-details">
                <Typography sx={{ width: "65%" }} variant="subtitle2">
                    {filterName}
                </Typography>
                <Typography sx={{ width: "35%" }} variant="body2">{filterValue ? filterValue : "N/A"}</Typography>
            </Box>
            <Divider />
        </>
    )
}

export default SingleReportFilterDetails