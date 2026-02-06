import React from 'react';
import CreateEmailTemplate from './CreateEmailTemplate';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import "./../../styles/CreateEmailTemplate.css";
import "./../../styles/sharedStyles.css";
const RapEmailTemplate = () => {
    const {state} = useLocation()
    return (
        <Box className="create-email-box-container custom-component-container-box">
        <CreateEmailTemplate forDataValue={"email"}data={state}/>
    </Box>
    );
};

export default RapEmailTemplate;