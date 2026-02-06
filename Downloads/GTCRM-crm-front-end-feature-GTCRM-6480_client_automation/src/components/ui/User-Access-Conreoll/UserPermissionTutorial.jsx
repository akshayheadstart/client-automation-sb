
/* eslint-disable jsx-a11y/anchor-has-content */
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Step, StepLabel, Stepper, Typography } from '@mui/material';
import React, { useState } from 'react';
import '../../../styles/userPermissionTutorial.css'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { Button } from 'rsuite'
import { imageLink1, imageLink2, imageLink3, imageLink4, imageLink5 } from '../../../images/imageAmajonS3Url';

const UserPermissionTutorial = ({ setOpenTutorialDialog, openTutorialDialog }) => {
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
                                <Typography data-testid="tutorial1" mb={1} variant='h6' >Check Permission</Typography>
                                <Typography variant="body1" >First of all Only, the Super admin can see all menu permissions as well as user roles, and only he/she will be able to update menu permissions and user role permissions</Typography>
                                <Typography variant="body1">In this step, First Super admin has to login, Then he has to check the menu like the below image, There have to be an option named User Permissions.  </Typography>
                                <Zoom> <img className='tutorial-image' src={imageLink1} alt="" />
                                </Zoom>
                                <Typography variant="body1 " >But if the option is not showing there, You have to give the Permission to Super Admin from this <a href={`${import.meta.env.VITE_API_BASE_URL}/docs`}>URL</a> </Typography>

                            </Box>

                        </Box>}
                        {activeStep === 1 && <Box className='tutorial-steps' sx={{ mt: 2 }}>

                            <Box px={2} >
                                <Typography mb={1} variant='h6' >Give Permission </Typography>
                                <Typography variant="body1" >At first Super admin has to  <a href={`${import.meta.env.VITE_API_BASE_URL}/docs`}>login here</a>(check below image)</Typography>

                                <Zoom>
                                    <img className='tutorial-image' src={imageLink2} alt="" />
                                </Zoom>
                                <Typography variant="body1 " > Then As below image, super admin permission should be set  </Typography>
                                <Zoom>
                                    <img className='tutorial-image' src={imageLink3} alt="" />
                                </Zoom>
                                <Typography variant="body1 " > After giving the permission Only Super Admin will be able to see the <b> "User permission"</b> menu in Side bar  </Typography>
                            </Box>

                        </Box>}
                        {activeStep === 2 && <Box className='tutorial-steps' sx={{ mt: 2 }}>

                            <Box px={2} >
                                <Typography mb={1} variant='h6' >Change Permissions </Typography>
                                <Typography variant="body1" > From this section( below image) super admin will change user permission. He can change menu permissions as well as user role permissions.
                                </Typography>

                                <Zoom>
                                    <img className='tutorial-image' src={imageLink4} alt="" />
                                </Zoom>
                                <Typography variant="body1 " >Then( below image) if Super admin expands the menu node, He/She will see all previous menu permissions for a particular user type. He/She can change the user permission by clicking a switch. Then  He/She has to click on save button </Typography>
                                <Zoom>
                                    <img className='tutorial-image' src={imageLink5} alt="" />
                                </Zoom>
                                <Typography variant="body1 " > After giving the permission Only Super Admin will be able to see the <b> "User permission"</b> menu in Side bar  </Typography>
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

export default UserPermissionTutorial;