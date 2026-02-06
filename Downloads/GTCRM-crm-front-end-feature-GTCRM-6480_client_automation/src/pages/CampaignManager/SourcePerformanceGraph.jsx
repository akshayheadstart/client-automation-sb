import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react'

const SourcePerformanceGraph = ({ sourceWiseDetailsGraphData }) => {

    return (
        <Box className="source-performance-graph-container">
            <Box className="grid-item item1">
                <Box>
                    <Typography variant="h5">{sourceWiseDetailsGraphData?.total_leads}</Typography>
                    <Typography sx={{ mt: "5%" }} variant="subtitle2">Total Leads</Typography>
                </Box>
            </Box>
            <Box className="grid-item item2">
                <Box>
                    <Typography variant="h5">{sourceWiseDetailsGraphData?.primary_leads}</Typography>
                    <Typography variant="subtitle2">Primary</Typography>
                </Box>
            </Box>
            <Box className="grid-item item3">
                <Box>
                    <Typography variant="h5">{sourceWiseDetailsGraphData?.secondary_leads}</Typography>
                    <Typography variant="subtitle2">Secondary</Typography>
                </Box>
            </Box>
            <Box className="grid-item item4">
                <Box>
                    <Typography variant="h5">{sourceWiseDetailsGraphData?.tertiary_leads}</Typography>
                    <Typography variant="subtitle2">Tertiary</Typography>
                </Box>
            </Box>
            <Box className="grid-item item5">
                <Box>
                    <Typography variant="h5">{sourceWiseDetailsGraphData?.verified_leads}</Typography>
                    <Typography variant="subtitle2">Verified</Typography>
                </Box>
            </Box>
            <Box className="grid-item item6">
                <Box>
                    <Typography variant="h5">{sourceWiseDetailsGraphData?.unverified_leads}</Typography>
                    <Typography sx={{ mt: "5%" }} variant="subtitle2">Unverified</Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default React.memo(SourcePerformanceGraph);