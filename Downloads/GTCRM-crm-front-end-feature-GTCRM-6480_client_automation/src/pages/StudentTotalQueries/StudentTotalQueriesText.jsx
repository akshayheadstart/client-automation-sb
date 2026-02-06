import { Typography } from '@mui/material';
import React from 'react';
import '../../styles/studentTotalQueries.css'
const StudentTotalQueriesText = ({labelText1, labelText2, value}) => {
    return (
        <>
            <Typography className='student-queries-header-text'>{labelText1}</Typography>
            <Typography className='student-queries-header-text'>{labelText2}</Typography>
            <Typography className='student-queries-header-text-value'>{value}</Typography>
        </>
    );
};

export default StudentTotalQueriesText;