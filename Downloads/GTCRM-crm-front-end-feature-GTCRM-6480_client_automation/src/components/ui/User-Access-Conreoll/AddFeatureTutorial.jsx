
/* eslint-disable jsx-a11y/anchor-has-content */
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Step, StepLabel, Stepper, Typography } from '@mui/material';
import React, { useState } from 'react';
import '../../../styles/userPermissionTutorial.css'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { Button } from 'rsuite'
import { feature1, feature2, feature3, feature4, feature5, feature6 } from '../../../images/imageAmajonS3Url';

const AddFeatureTutorial = ({ setOpenTutorialDialog, openTutorialDialog }) => {
    const [activeStep, setActiveStep] = useState(0);
    const STEPS = ['Step 1', 'Step 2', 'Step 3'];

    const handleNextStep = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBackStep = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleCloseTutorialDialog = () => {
        setActiveStep(0);
        setOpenTutorialDialog(false);
    };
    return (
        <Box>
            <Dialog
                open={openTutorialDialog}
                onClose={handleCloseTutorialDialog}
                fullWidth={true}
                scroll={"paper"}
            >
                <DialogTitle mt={2} id="scroll-dialog-title" data-testid="dialog-title">
                    <Stepper activeStep={activeStep}>
                        {STEPS.map((label, index) => {
                            const stepProps = {};
                            const labelProps = {};

                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                </DialogTitle>
                <DialogContent className='tutorial-text'>
                    <Box sx={{ width: '100%' }}>

                        {activeStep === 0 && <Box className='tutorial-steps' sx={{ mt: 2 }}>

                            <Box px={2} >
                                <Typography data-testid="tutorial1" mb={1} variant='h6' >Add New Feature</Typography>
                                <Typography variant="body1" >First of all Only, Super Admin can add new features. Please click on the Features button.</Typography>
                                <Zoom> <img className='tutorial-image' src={feature1} alt="" />
                                </Zoom>
                            </Box>
                        </Box>}
                        {activeStep === 1 && <Box className='tutorial-steps' sx={{ mt: 2 }}>

                            <Box px={2} >
                                <Typography mb={1} variant='h6' >Select Sub Menu and Add New Features </Typography>
                                <Typography variant="body1" >After clicking on the feature button you will be taken to this page. From here you can select submenus and add new features.</Typography>

                                <Zoom>
                                    <img className='tutorial-image' src={feature2} alt="" />
                                </Zoom>
                                <Typography variant="body1 " > When selecting the submenu. Then The icon will show on the side, if you hover the icon, you can see what are the previous features in this sub menu.</Typography>
                                <Zoom>
                                    <img className='tutorial-image' src={feature3} alt="" />
                                </Zoom>
                            </Box>

                        </Box>}
                        {activeStep === 2 && <Box className='tutorial-steps' sx={{ mt: 2 }}>

                            <Box px={2} >
                                <Typography mb={1} variant='h6' >Add Feature and Submit </Typography>
                                <Typography variant="body1" >Enter the new feature name in the Feature Name Input section and Click the plus button, then add feature. You can add more than one feature if you need. Click the next button when you are done adding your feature.If you want to go back then click on the back button
                                </Typography>

                                <Zoom>
                                    <img className='tutorial-image' src={feature6} alt="" />
                                </Zoom>
                                <Typography variant="body1" > After adding new feature you can delete feature if you want.
                                </Typography>

                                <Zoom>
                                    <img className='tutorial-image' src={feature4} alt="" />
                                </Zoom>
                                <Typography variant="body1 " >When sub menu is selected and new feature is added. Then click on the next button and you will come to this page .From here you can make a review and if you want to go back then click on the back button. Once the review is done, click on the submit button. </Typography>
                                <Zoom>
                                    <img className='tutorial-image' src={feature5} alt="" />
                                </Zoom>
                                
                            </Box>

                        </Box>}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Box className='tutorial-page-dialog-buttons' sx={{ pt: 2, px: 1 }}>
                        <Button onClick={handleCloseTutorialDialog} style={{ marginRight: "5px" }}>
                            Close
                        </Button>

                        {activeStep < STEPS.length && <Box>
                            <Button
                                disabled={activeStep === 0}
                                onClick={handleBackStep}
                                style={{ marginRight: "5px" }}
                            >
                                Back
                            </Button>

                            <Button
                                disabled={activeStep === STEPS.length - 1}
                                color="cyan" appearance="primary" onClick={handleNextStep}>
                                Next
                            </Button>
                        </Box>}
                    </Box>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default AddFeatureTutorial;