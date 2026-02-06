import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Box, Checkbox, CircularProgress, TextField, Typography } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import '../../styles/newtimeline.css'
import { useState } from 'react';
import { isValidPhoneNumber } from '../../utils/validation';
import { emailValid, phoneNumberLengthCount } from '../../hooks/GetJsonDate';
import { useHandleAddSecondaryEmailMutation, useHandleAddSecondaryPhoneMutation } from '../../Redux/Slices/filterDataSlice';
import { DashboradDataContext } from '../../store/contexts/DashboardDataContext';
import { useSelector } from 'react-redux';
import useToasterHook from '../../hooks/useToasterHook';
import { handleSomethingWentWrong } from '../../utils/handleSomethingWentWrong';
import { handleInternalServerError } from '../../utils/handleInternalServerError';
import Error500Animation from '../shared/ErrorAnimation/Error500Animation';
import { ErrorFallback } from '../../hooks/ErrorFallback';
import { useDispatch } from 'react-redux';
import { tableSlice } from '../../Redux/Slices/applicationDataApiSlice';
const AddSecondaryMobileAndEmailDialog = ({addSecondaryMobileAndEmailOpen,handleAddSecondaryMobileAndEmailClose,toggleDialogContent,studentId,userProfileLeadsDetails}) => {
  const dispatch = useDispatch();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [secondaryEmail, setSecondaryEmail] = useState(userProfileLeadsDetails?.secondary_email?userProfileLeadsDetails?.secondary_email:"");
    const [secondaryCheckbox, setSecondaryCheckBox]=useState(userProfileLeadsDetails?.secondary_email_set_as_default)
    const [errorSecondaryEmail, setSecondaryErrorEmail] = useState("");
    const [tertiaryEmail, setTertiaryEmail] = useState(userProfileLeadsDetails?.tertiary_email ?userProfileLeadsDetails?.tertiary_email:"");
    const [tertiaryCheckBox, setTertiaryCheckBox] = useState(userProfileLeadsDetails?.tertiary_email_set_as_default);
    const [tertiaryErrorEmail, setTertiaryErrorEmail] = useState("");
    const [secondaryPhoneNumber,setSecondaryPhoneNumber]=useState(userProfileLeadsDetails?.secondary_mobile?userProfileLeadsDetails?.secondary_mobile:'')
    const [secondaryPhoneNumberCheckbox, setSecondaryPhoneNumberCheckBox]=useState(userProfileLeadsDetails?.secondary_number_set_as_default)
  const [errorSecondaryPhoneNumber,setErrorSecondaryPhoneNumber]=useState('')
    const [tertiaryPhoneNumber,setTertiaryPhoneNumber]=useState(userProfileLeadsDetails?.tertiary_mobile?userProfileLeadsDetails?.tertiary_mobile:"")
    const [tertiaryPhoneNumberCheckbox, setTertiaryPhoneNumberCheckBox]=useState(userProfileLeadsDetails?.tertiary_number_set_as_default);
  const [errorTertiaryPhoneNumber,setErrorTertiaryPhoneNumber]=useState('')
  const emailPayload={
    secondaryEmail,
    secondaryCheckbox:secondaryCheckbox?true:false,
    tertiaryEmail,
    tertiaryCheckBox:tertiaryCheckBox?true:false
  }
  const phonePayload={
    secondaryPhoneNumber,
    secondaryPhoneNumberCheckbox:secondaryPhoneNumberCheckbox?true:false,
    tertiaryPhoneNumber,
    tertiaryPhoneNumberCheckbox:tertiaryPhoneNumberCheckbox?true:false
  }
  const [loading, setLoading]=useState(false)
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
    const [somethingWentWrongInAddSecondaryEmailAndTertiary, setSomethingWentWrongInAddSecondaryEmailAndTertiary] =
    useState(false);
  const [addSecondaryEmailAndTertiaryInternalServerError, setAddSecondaryEmailAndTertiaryInternalServerError] =
    useState(false);
    const pushNotification = useToasterHook();
  const [addSecondaryEmailAndTertiary] = useHandleAddSecondaryEmailMutation();
  const handleAddSecondaryEmailAndTertiary = () => {
    setLoading(true);
    addSecondaryEmailAndTertiary({ dataValue: emailPayload,studentId, collegeId })
      .unwrap()
      .then((res) => {
        if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        } else if (res?.message) {
          try {
            if (typeof res?.message === "string") {
              handleAddSecondaryMobileAndEmailClose();
              pushNotification("success", res?.message);
              dispatch(tableSlice.util.invalidateTags(['UserProfileLeadDetails']));
            } else {
              throw new Error("Add Secondary Email API response changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInAddSecondaryEmailAndTertiary,"",5000
            );
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(
          setAddSecondaryEmailAndTertiaryInternalServerError,
          '',
          5000
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [somethingWentWrongInAddSecondaryPhoneAndTertiary, setSomethingWentWrongInAddSecondaryPhoneAndTertiary] =
    useState(false);
  const [addSecondaryPhoneAndTertiaryInternalServerError, setAddSecondaryPhoneAndTertiaryInternalServerError] =
    useState(false);
    const [addSecondaryPhoneAndTertiary] = useHandleAddSecondaryPhoneMutation();
  const handleAddSecondaryPhoneAndTertiary = () => {
    setLoading(true);
    addSecondaryPhoneAndTertiary({ dataValue: phonePayload,studentId, collegeId })
      .unwrap()
      .then((res) => {
        if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        } else if (res?.message) {
          try {
            if (typeof res?.message === "string") {
              handleAddSecondaryMobileAndEmailClose();
              pushNotification("success", res?.message);
              dispatch(tableSlice.util.invalidateTags(['UserProfileLeadDetails']));
            } else {
              throw new Error("Add Secondary phone API response changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInAddSecondaryPhoneAndTertiary,"",5000
            );
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(
          setAddSecondaryPhoneAndTertiaryInternalServerError,
          '',
          5000
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };
    return (
        <React.Fragment>
        <Dialog
          fullScreen={fullScreen}
          open={addSecondaryMobileAndEmailOpen}
          onClose={handleAddSecondaryMobileAndEmailClose}
          aria-labelledby="responsive-dialog-title"
        >
          <Box sx={{py:'18px'}} className="comment-dialog-headline-box-container">
          <Typography className="comment-dialog-headline-text">
            Add Secondary {toggleDialogContent?'Email':'Mobile'}
          </Typography>
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={() => {
                handleAddSecondaryMobileAndEmailClose();
            }}
          />
        </Box>
        {
          loading &&
        <Box sx={{display:'grid',placeItems:'center'}}>
        <CircularProgress color='info' />
        </Box>
        }
        {
          somethingWentWrongInAddSecondaryEmailAndTertiary ||
          addSecondaryEmailAndTertiaryInternalServerError ||addSecondaryPhoneAndTertiaryInternalServerError ||
          somethingWentWrongInAddSecondaryPhoneAndTertiary ? (
            <Box>
              {(addSecondaryEmailAndTertiaryInternalServerError ||addSecondaryPhoneAndTertiaryInternalServerError) && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {(somethingWentWrongInAddSecondaryEmailAndTertiary || somethingWentWrongInAddSecondaryPhoneAndTertiary) && (
                <ErrorFallback
                  error={apiResponseChangeMessage}
                  resetErrorBoundary={() => window.location.reload()}
                />
              )}
            </Box>
          )
          :
          <DialogContent sx={{px:'24px'}}>
            {
                toggleDialogContent &&
            <Box className='add-mail-box-container'>
                <Box>
            <TextField
            defaultValue={userProfileLeadsDetails?.secondary_email}
              fullWidth="50%" 
              id="filled-size-normal"
              helperText={errorSecondaryEmail}
              label=' Secondary Email'
              size='small'
              error={errorSecondaryEmail}
              onChange={(e) => {
                const email = e.target.value;
                const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

                if (isEmailValid) {
                  setSecondaryErrorEmail("");
                  setSecondaryEmail(email);
                } else {
                  setSecondaryEmail(email);
                  setSecondaryErrorEmail("Please enter a valid email");
                }
              }}
              color="info"
            />
            <Box className='add-secondary-mail-box'>
                <Checkbox size='small' color='info' checked={secondaryCheckbox} disabled={!emailValid(secondaryEmail)} onChange={(e)=>setSecondaryCheckBox(e.target.checked)}/>
                <Typography sx={{color:'#008BE2',fontSize:'12px'}}>Set as Default</Typography>
            </Box>
                </Box>
                <Box>
            <TextField
              fullWidth="50%"
              color="info"
              id="filled-size-normal"
              helperText={tertiaryErrorEmail}
              label='Tertiary Email'
              size='small'
              error={tertiaryErrorEmail}
              disabled={!emailValid(secondaryEmail)}
              onChange={(e) => {
                const email = e.target.value;
                const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

                if (isEmailValid) {
                  setTertiaryErrorEmail("");
                  setTertiaryEmail(email);
                } else {
                  setTertiaryEmail(email);
                  setTertiaryErrorEmail("Please enter a valid email");
                }
              }}
              defaultValue={userProfileLeadsDetails?.tertiary_email}
            />
              <Box className='add-secondary-mail-box'>
                <Checkbox checked={tertiaryCheckBox} size='small' color='info' onChange={(e)=>setTertiaryCheckBox(e.target.checked)} disabled={!emailValid(secondaryEmail)}/>
                <Typography sx={{color:'#008BE2',fontSize:'12px'}}>Set as Default</Typography>
            </Box>
                </Box>
            </Box>
            }
            {
                toggleDialogContent === false &&
            <Box className='add-mail-box-container'>
                <Box>
                <TextField
                defaultValue={userProfileLeadsDetails?.secondary_mobile}
                fullWidth="50%"
                label="Secondary Mobile"
                id="filled-size-normal"
                size='small'
                color="info"
                helperText={errorSecondaryPhoneNumber}
                error={errorSecondaryPhoneNumber}
                onChange={(e) => {
                const isCharValid = isValidPhoneNumber(e.target.value);
                if (isCharValid) {
                    setSecondaryPhoneNumber(e.target.value)
                    setErrorSecondaryPhoneNumber('');
                }  else {
                  setSecondaryPhoneNumber(e.target.value)
                    setErrorSecondaryPhoneNumber(
                    "Phone number must be valid and 10 digit"
                    );
                }
                }}
            />
            <Box className='add-secondary-mail-box'>
                <Checkbox size='small' color='info' checked={secondaryPhoneNumberCheckbox} disabled={!phoneNumberLengthCount(secondaryPhoneNumber)} onChange={(e)=>setSecondaryPhoneNumberCheckBox(e.target.checked)}/>
                <Typography sx={{color:'#008BE2',fontSize:'12px'}}>Set as Default</Typography>
            </Box>
                </Box>
                <Box>
                <TextField
                required
                defaultValue={userProfileLeadsDetails?.tertiary_mobile}
                fullWidth="50%"
                color="info"
                placeholder=" Tertiary Mobile"
                id="filled-size-normal"
                helperText={errorTertiaryPhoneNumber}
                error={errorTertiaryPhoneNumber}
                size='small'
                disabled={!phoneNumberLengthCount(secondaryPhoneNumber)}
                onChange={(e) => {
                const isCharValid = isValidPhoneNumber(e.target.value);
                if (isCharValid) {
                    setTertiaryPhoneNumber(e.target.value)
                    setErrorTertiaryPhoneNumber('');
                }  else {
                  setTertiaryPhoneNumber(e.target.value)
                    setErrorTertiaryPhoneNumber(
                    "Phone number must be valid and 10 digit"
                    );
                }
                }}
            />
              <Box className='add-secondary-mail-box'>
                <Checkbox size='small' color='info' checked={tertiaryPhoneNumberCheckbox} onChange={(e)=>setTertiaryPhoneNumberCheckBox(e.target.checked)} disabled={!phoneNumberLengthCount(secondaryPhoneNumber)}/>
                <Typography sx={{color:'#008BE2',fontSize:'12px'}}>Set as Default</Typography>
            </Box>
                </Box>
            </Box>
            }
          <Box sx={{display:'grid',placeItems:'center', px:'24px',pb:'24px',mt:'20px'}}>
            {
              toggleDialogContent &&
            <Button
              sx={{ borderRadius: 50 }}
              variant="contained"
              size="medium"
              type="submit"
              color="info"
              disabled={!emailValid(secondaryEmail)}
              onClick={() => {
                if(toggleDialogContent){
                  handleAddSecondaryEmailAndTertiary()
                }
              }}
            >
              Save
            </Button>
            }
            {
              !toggleDialogContent &&
            <Button
              sx={{ borderRadius: 50 }}
              variant="contained"
              size="medium"
              type="submit"
              color="info"
              disabled={!phoneNumberLengthCount(secondaryPhoneNumber)}
              onClick={() => {
                  handleAddSecondaryPhoneAndTertiary()
                
              }}
            >
              Save
            </Button>
            }
          </Box>
          </DialogContent>
        }
        </Dialog>
      </React.Fragment>
    );
};

export default AddSecondaryMobileAndEmailDialog;