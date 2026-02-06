import React from 'react';
import CreateSmsTemplate from './CreateSmsTemplate';
import { Box } from '@mui/material';
import "./../../styles/CreateWhatsAppTemplate.css";
import "./../../styles/sharedStyles.css";
import { useLocation } from 'react-router-dom';

const RapSmsTemplate = () => {
  const {state} = useLocation()
    return (
        <Box className="whats-app-template-box-container custom-component-container-box">
          <CreateSmsTemplate forDataValue={"sms"} data={state}/>
      </Box>
    );
};

export default RapSmsTemplate;