import React from 'react';
import CreateWhatsAppTemplate from './CreateWhatsAppTemplate';
import { Box } from '@mui/material';
import "./../../styles/CreateWhatsAppTemplate.css";
import "./../../styles/sharedStyles.css";
import { useLocation } from 'react-router-dom';

const RapWhatsAppTemplate = () => {
    const {state} = useLocation()
    return (
        <Box className="whats-app-template-box-container custom-component-container-box">
        <CreateWhatsAppTemplate forDataValue={"whats-app"} data={state}/>
    </Box>
    );
};

export default RapWhatsAppTemplate;