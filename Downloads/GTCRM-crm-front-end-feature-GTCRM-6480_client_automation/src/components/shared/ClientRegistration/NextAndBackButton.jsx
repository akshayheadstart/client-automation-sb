import { Box, Button } from '@mui/material'
import React from 'react'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState } from 'react';
import RegBackdrop from './RegBackdrop';

const NextAndBackButton = ({ handleBack, handleNext, disableNext, handleClientRegistration, setTitleOfDialog, setOpenDetailsDialog }) => {
    const [loadingReg, setLoadingReg] = useState(false);

    return (
        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Button onClick={() => handleBack()} startIcon={<NavigateBeforeIcon />} variant="contained">
                Back
            </Button>
            {handleClientRegistration ? (
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        onClick={() => {
                            setTitleOfDialog("Preview");
                            setOpenDetailsDialog(true)
                        }}
                        startIcon={<VisibilityIcon />} variant="contained" >Preview</Button>

                    <Button variant="contained"
                        onClick={() => {
                            setLoadingReg(true)
                            handleClientRegistration(setLoadingReg)
                        }}
                    >Register
                    </Button>

                </Box>
            ) : (<Button variant="contained"
                disabled={disableNext}
                onClick={() => handleNext()}
                endIcon={<NavigateNextIcon />}
            >
                Next
            </Button>)}
            <RegBackdrop
                open={loadingReg}
            >
            </RegBackdrop>
        </Box>
    )
}

export default NextAndBackButton