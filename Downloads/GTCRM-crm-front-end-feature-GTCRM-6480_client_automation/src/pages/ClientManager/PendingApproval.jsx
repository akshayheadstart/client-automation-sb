import { Box, Typography } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import "../../styles/ClientManager.css"
import "../../styles/sharedStyles.css"
import GetCollegeByStatus from './GetCollegeByStatus';
import { LayoutSettingContext } from '../../store/contexts/LayoutSetting';

const PendingApproval = () => {


    const info = {
        pending: true,
        approve: false,
        reject: false,
        pageNumberKey: "listOfPendingCollegesPageNo",
        rowPerPageKey: "listOfPendingCollegesRowPerPage"
    }
    const statusOptions = [{ label: "Approve", value: "approved" }, { label: "Decline", value: "declined" }]
    const { setHeadTitle, headTitle, selectedSeason } =
    useContext(LayoutSettingContext);
    useEffect(() => {
        setHeadTitle("Pending Approval List");
        document.title = "Pending Approval List";
      }, [headTitle]);
    return (
        <Box sx={{ mx: 2, my: 3 }} className="client-manager-container">
            <Box className="custom-component-container-box">
            <GetCollegeByStatus info={info} statusOptions={statusOptions} />
            </Box>
        </Box>
    )
}

export default PendingApproval