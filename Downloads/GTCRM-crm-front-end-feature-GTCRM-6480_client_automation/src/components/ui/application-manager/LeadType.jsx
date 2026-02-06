import { Box } from '@mui/material';
import React from 'react'

const LeadType = ({ rowData }) => {
    const { lead_type } = rowData || {};
    return (
        <Box className={`${lead_type?.toLowerCase()} status`}>
            {lead_type ? lead_type : `– –`}
        </Box>
    )
}

export default LeadType