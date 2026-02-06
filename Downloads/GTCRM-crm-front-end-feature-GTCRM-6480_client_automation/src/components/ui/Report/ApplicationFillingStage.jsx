import { Box, Divider, Typography } from '@mui/material'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { formStageList } from '../../../constants/LeadStageList'

const ApplicationFillingStage = ({ filterName, filterValue }) => {
    const [fillingStagesName, setFillingStagesName] = useState([])
    useEffect(() => {
        const stages = [];
        formStageList.forEach((list) => {
            const index = filterValue?.findIndex((value) => value.current_stage === list.value?.current_stage);
            if (index !== -1) {
                stages.push(list.label)
            }
        })
        setFillingStagesName(stages)
    }, [filterValue])
    return (
        <>
            <Box className="report-filter-details">
                <Typography sx={{ width: "65%" }} variant="subtitle2">
                    {filterName}
                </Typography>
                {filterValue?.length ? (
                    <ul className="report-multiple-filter-details">
                        {fillingStagesName.map(item =>
                            <>
                                <li key={item}>  {item}</li>

                            </>
                        )}
                    </ul>
                ) : <Typography sx={{ width: "35%" }} variant="body2">N/A</Typography>}

            </Box>
            <Divider />
        </>
    )
}
export default ApplicationFillingStage