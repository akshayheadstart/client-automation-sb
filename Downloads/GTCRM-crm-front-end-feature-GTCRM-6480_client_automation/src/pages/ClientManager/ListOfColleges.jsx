import { Box, Typography } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import "../../styles/ClientManager.css"
import "../../styles/sharedStyles.css"
import GetCollegeByStatus from './GetCollegeByStatus';
import { LayoutSettingContext } from '../../store/contexts/LayoutSetting';

const ListOfColleges = () => {

    const info = {
        pending: false,
        approve: true,
        reject: true,
        pageNumberKey: "listOfCollegesPageNo",
        rowPerPageKey: "listOfCollegesRowPerPage"
    }

    const statusOptions = [{ label: "Approve", value: "approved" }, { label: "Decline", value: "declined" }, { label: "Pending", value: "pending" }]
    const { setHeadTitle, headTitle, selectedSeason } =
    useContext(LayoutSettingContext);
    useEffect(() => {
        setHeadTitle("All Colleges Form List");
        document.title = "All Colleges Form List";
      }, [headTitle]);
    return (
        <Box sx={{ mx: 2, my: 3 }} className="client-manager-container">
            <Box className="custom-component-container-box">
            <GetCollegeByStatus info={info} editForm={true} statusOptions={statusOptions} />
            </Box>
        </Box>
    )
}

export default ListOfColleges