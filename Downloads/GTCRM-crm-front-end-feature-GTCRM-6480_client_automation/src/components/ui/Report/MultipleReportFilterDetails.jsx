import { Box, Divider, Typography } from '@mui/material'
import React from 'react'

const MultipleReportFilterDetails = ({ filterName, filterValue }) => {
    return (
        <>
            <Box className="report-filter-details">
                <Typography sx={{ width: "65%" }} variant="subtitle2">
                    {filterName}
                </Typography>
                {filterValue?.length ? (
                    <ul className="report-multiple-filter-details">
                        {filterValue.map(item =>
                            <>
                                <li>{filterName === "Lead Stage" ? item.name?.map(element => <li >{element}</li>) : item}</li>
                                {filterName === "Lead Stage" && item.label.map(element => <li style={{ marginLeft: "35px" }}>{element}</li>)}
                            </>
                        )}
                    </ul>
                ) : <Typography sx={{ width: "35%" }} variant="body2">N/A</Typography>}

            </Box>
            <Divider />
        </>
    )
}
export default MultipleReportFilterDetails