import { Box, Divider, Typography } from '@mui/material'
import React from 'react'

const BillingDetails = ({ title, content }) => {
    const isTotal = title === "Total Charge";
    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: isTotal ? "#e0eeff" : "", p: isTotal ? .5 : 0 }}>
                <Typography variant={isTotal ? "subtitle1" : "subtitle2"}>{title}</Typography>
                <Typography variant={isTotal ? "subtitle1" : ""}>{content}</Typography>
            </Box>
            {!isTotal && <Divider sx={{ my: 1 }} />}
        </>
    )
}

export default BillingDetails