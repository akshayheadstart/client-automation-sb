import React from 'react';
import "../../styles/leadofflinePayment.css";
import { Button } from '@mui/material';
const PdfNextButton = ({onclick,startIcon,disabled,endIcon}) => {
    return (
        <Button
        data-testid="button-back-items"
        className="invoice-pdf-button-design"
        onClick={onclick}
        size="small"
        color="info"
        variant="outlined"
        startIcon={startIcon}
        endIcon={endIcon}
        disabled={disabled}
      >
      </Button>
    );
};

export default PdfNextButton;