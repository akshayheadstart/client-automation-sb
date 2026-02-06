/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from '@mui/material';
import React from 'react';
import '../../styles/studentTotalQueries.css'
import StudentTotalQueriesHeader from './StudentTotalQueriesHeader';
import StudentTotalQueriesTable from './StudentTotalQueriesTable';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { LayoutSettingContext } from '../../store/contexts/LayoutSetting';
import { useLocation } from 'react-router-dom';

const StudentTotalQueries = () => {
    const {state}=useLocation()
    const [filterDateValue,setFilterDateValue] = useState([])
    const {setHeadTitle,
        headTitle } = useContext(LayoutSettingContext);
        useEffect(()=>{
            setHeadTitle('Student Total Queries')
            document.title = 'Student Total Queries';
          },[headTitle])
    return (
        <Box className='student-queries-box-container student-Total-queries-header-box-container'>
            {
                !state?.eventType &&
            <StudentTotalQueriesHeader
            setFilterDateValue={setFilterDateValue}
            filterDateValue={filterDateValue}
            ></StudentTotalQueriesHeader>
            }
            <StudentTotalQueriesTable
            setFilterDateValue={setFilterDateValue}
            filterDateValue={filterDateValue}
            state={state}
            ></StudentTotalQueriesTable>
        </Box>
    );
};

export default StudentTotalQueries;