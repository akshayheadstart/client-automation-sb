import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import React from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { forgetPasswordEmailTemplate, loginEmailTemplate, otpEmailTemplate, paymentEmailTemplate } from '../../../images/imageAmajonS3Url'
import "../../../styles/CreateEmailTemplate.css"

const TemplateCreateInfoDialog = ({ openCreateTemplateInfoDialog, setOpenCreateTemplateInfoDialog, emailCategory }) => {


    const handleClose = () => {
        setOpenCreateTemplateInfoDialog(false);
    };


    return (
        <Dialog
            open={openCreateTemplateInfoDialog}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {emailCategory?.toLowerCase() === "forget_password" && <Alert severity="warning" sx={{ fontWeight: "bold" }}>You have to follow the below sample template when creating forget password email template.</Alert>}

                {emailCategory?.toLowerCase() === "login" && <Alert severity="warning" sx={{ fontWeight: "bold" }}>You have to follow the below sample template when creating login email template.</Alert>}

                {emailCategory?.toLowerCase() === "payment" && <Alert severity="warning" sx={{ fontWeight: "bold" }}>You have to follow the below sample template when creating payment email template.</Alert>}

                {emailCategory?.toLowerCase() === "otp" && <Alert severity="warning" sx={{ fontWeight: "bold" }}>You have to follow the below sample template when creating OTP email template.</Alert>}
            </DialogTitle>
            <DialogContent>
                {emailCategory?.toLowerCase() === "forget_password" && <Box px={2}>
                    <Zoom>
                        <img className='create-template-tutorial-image' src={forgetPasswordEmailTemplate} alt="forget-password-email-template" />
                    </Zoom>
                    <Typography variant="body1">Here you have to provide a button to reset password, When user click on this button we redirect user to reset password page. Also you can provide URL like this - <span className="create-template-tutorial-highlight">If you want to reset your password. Please click on this link: {`{reset URL}`}</span>.So you must provide those things as mentioned and other things as your wish. Otherwise wrong email will send.</Typography>
                </Box>
                }

                {emailCategory?.toLowerCase() === "login" && <Box px={2}>
                    <Zoom>
                        <img className='create-template-tutorial-image' src={loginEmailTemplate} alt="payment-email-template" />
                    </Zoom>
                    <Typography variant="body1">Here you have to provide curly brackets <span className="create-template-tutorial-highlight">{`{Institute Name}`}</span>, In this place Institute Name will go during email send. After that <span className="create-template-tutorial-highlight">{`{name}`}</span> here user name will go, <span className="create-template-tutorial-highlight">{`{Institute Name}`}</span> institute name will go, <span className="create-template-tutorial-highlight">{`{email id}`}</span> email id will go, <span className="create-template-tutorial-highlight">{`{mobile number}`}</span> mobile number will go, <span className="create-template-tutorial-highlight">{`{admission year}`}</span> admission year will go, <span className="create-template-tutorial-highlight">{`{Institute website URL}`}</span> institute website URL will go,<span className="create-template-tutorial-highlight">{`{email id}`}</span> email id will go, <span className="create-template-tutorial-highlight">{`{password}`}</span> password will go. Then you have to provide a button to login directly, When user click on this button we redirect user to website. Also you can provide URL like this - <span className="create-template-tutorial-highlight">If you want to verify and start your application. Please click on this link: {`{verify URL}`}</span>. Then <span className="create-template-tutorial-highlight">{`{Institute contact email id}`}</span> institute contact email id will go, <span className="create-template-tutorial-highlight">{`{Institute Name}`}</span> institute name will go, <span className="create-template-tutorial-highlight">{`{Institute website URL}`}</span> institute website URL will go, <span className="create-template-tutorial-highlight">{`{contact number}`}</span> contact number will go, <span className="create-template-tutorial-highlight">{`{Institute admission email id}`}</span> institute admission email id will go. So you must provide those things as mentioned and other things as your wish. Otherwise wrong email will send.</Typography>
                </Box>
                }

                {emailCategory?.toLowerCase() === "payment" && <Box px={2}>
                    <Zoom>
                        <img className='create-template-tutorial-image' src={paymentEmailTemplate} alt="payment-email-template" />
                    </Zoom>
                    <Typography variant="body1">Here you have to provide curly brackets <span className="create-template-tutorial-highlight">{`{Institute Name}`}</span>, In this place Institute Name will go during email send. After that <span className="create-template-tutorial-highlight">{`{name}`}</span> here user name will go, <span className="create-template-tutorial-highlight">{`{fees}`}</span> application fee will go, <span className="create-template-tutorial-highlight">{`{application id}`}</span> application id will go, <span className="create-template-tutorial-highlight">{`{payment id}`}</span> payment id will go. At last <span className="create-template-tutorial-highlight">{`{Institute Name}`}</span>. So you must provide those things as mentioned and other things as your wish. Otherwise wrong email will send.</Typography>
                </Box>
                }

                {emailCategory?.toLowerCase() === "otp" && <Box px={2}>
                    <Zoom>
                        <img className='create-template-tutorial-image' src={otpEmailTemplate} alt="otp-email-template" />
                    </Zoom>
                    <Typography variant="body1">Here you have to provide curly brackets <span className="create-template-tutorial-highlight">{`{Institute Name}`}</span>, In this place Institute Name will go during email send. After that <span className="create-template-tutorial-highlight">{`{name}`}</span> here user name will go, <span className="create-template-tutorial-highlight">{`{OTP code}`}</span> OTP code will go. At last <span className="create-template-tutorial-highlight">{`{Institute Name}`}</span>. So you must provide those things as mentioned and other things as your wish. Otherwise wrong email will send.</Typography>
                </Box>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default TemplateCreateInfoDialog