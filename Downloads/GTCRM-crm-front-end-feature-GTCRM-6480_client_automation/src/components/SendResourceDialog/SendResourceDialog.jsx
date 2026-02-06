import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import CloseIcon from "@mui/icons-material/Close";
import '../../styles/updateResource.css'
import '../../styles/newtimeline.css';
import '../../styles/sharedStyles.css'
import { Autocomplete, Box, CircularProgress, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHandleUpdateResourceContentMutation } from '../../Redux/Slices/filterDataSlice';
import useToasterHook from '../../hooks/useToasterHook';
import { handleSomethingWentWrong } from '../../utils/handleSomethingWentWrong';
import { handleInternalServerError } from '../../utils/handleInternalServerError';
import { DashboradDataContext } from '../../store/contexts/DashboardDataContext';
import Error500Animation from '../shared/ErrorAnimation/Error500Animation';
import { ErrorFallback } from '../../hooks/ErrorFallback';
import { permissionConfig } from '../../constants/LeadStageList';
import { extractValuesAutoComplete } from '../../helperFunctions/filterHelperFunction';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const SendResourceDialog = ({sendMessageDialogOpen,handleSendMessageDialogClose,setPageNumber,setFirstEnterPageLoading,setGetAllUpdateAPIcall,setAllResourceContent}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [message, setMessage] = useState('')
  const [title, setTitle] = useState('')
  const [selectedUserId, setSelectedUserId]=useState([])
  const [userTypeList, setUserTypeList] = useState([]);
  const permission = useSelector(
    (state) => state?.authentication?.permissions?.permission
  );
  useEffect(() => {
    const userTypes = [];
    Object.entries(permissionConfig).forEach(([permissionKey, userTypeConfig]) => {
      if (permission?.[permissionKey]) {
        userTypes.push(userTypeConfig);
      }
    });
    setUserTypeList(userTypes);
  }, [permission]);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();
  const payload={
    selected_profiles:extractValuesAutoComplete(selectedUserId),
    title,
    content:message
  }
  const [updateResourceContentInternalServerError, setUpdateResourceContentInternalServerError] =
    useState(false);
  const [somethingWentWrongInUpdateResourceContent, setSomethingWentWrongInUpdateResourceContent] =
    useState(false);
    const [loading, setLoading]=useState(false)
    const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [updateResource] = useHandleUpdateResourceContentMutation();
  const handleUpdateDocumentStatus = () => {
    setLoading(true)
    updateResource({
    collegeId: collegeId,
    dataValue:payload
    })
      .unwrap()
      .then((res) => {
        if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        } else if (res?.message) {
          try {
            if (typeof res?.message === "string") {
              pushNotification("success", "Updated Resource Success");
              handleSendMessageDialogClose();
              setPageNumber(1);
              setFirstEnterPageLoading(true);
              setGetAllUpdateAPIcall(true);
              setAllResourceContent([]);
            } else {
              throw new Error("Update Resource API response changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInUpdateResourceContent,
              "",
              5000
            );
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(setUpdateResourceContentInternalServerError, "", 5000);
      })
      .finally(()=>{
        setLoading(false)
      })
  };
    return (
        <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={sendMessageDialogOpen}
        onClose={handleSendMessageDialogClose}
        aria-labelledby="responsive-dialog-title"
        className='change-dialog-box-resource-container'
      >
        <Box className="comment-dialog-headline-box-container">
          <Typography className="comment-dialog-headline-text">
            Send Update
          </Typography>
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={() => {
                handleSendMessageDialogClose();
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
           somethingWentWrongInUpdateResourceContent ||
           updateResourceContentInternalServerError  ? (
             <>
               {(updateResourceContentInternalServerError) && (
                 <Error500Animation height={400} width={400}></Error500Animation>
               )}
               {(somethingWentWrongInUpdateResourceContent) && (
                 <ErrorFallback
                   error={apiResponseChangeMessage}
                   resetErrorBoundary={() => window.location.reload()}
                 />
               )}
             </>
           ):
        <DialogContent>
         <Autocomplete
          value={selectedUserId}
          multiple
          required
          id="checkboxes-tags-demo"
          size="small"
          getOptionLabel={(option) => option.label}
          options={userTypeList}
          disableCloseOnSelect
          onChange={(event, newValue) => {
            
            setSelectedUserId(newValue);
            
          }}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
              color='info'
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.label}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              label="Select Profile"
              name="programs"
              {...params}
              sx={{width:'100%'}}
              color="info"
            />
          )}
        />
        <TextField
        sx={{ mt: 2 }}
        fullWidth
        label='Title'
        id="outlined-controlled"
        multiline
        size='small'
        value={title}
        rows={1}
        onChange={(e) => {
            setTitle(e.target.value);
        }}
        color="info"
        />
        <TextField
        sx={{ mt: 2 }}
        fullWidth
        label='Update content'
        id="outlined-controlled"
        multiline
        rows={4}
        value={message}
        onChange={(e) => {
            setMessage(e.target.value);
        
        }}
        color="info"
        />
        <Box className="update-resource-button-container">
        <Button
              sx={{ borderRadius: 50, px:'3px' }}
              className='send-button-design'
              variant="contained"
              size="small"
              type="submit"
              color="info"
              onClick={() => {
                handleUpdateDocumentStatus();
              }}
              disabled={title?.length < 1 ||message?.length<1 ||selectedUserId?.length===0}
            >
              Send
            </Button>
            <Button
              sx={{ borderRadius: 50,height:'25px',fontSize:'12px',color:'#0a2d4c'}}
              onClick={() => {
                handleSendMessageDialogClose();
            }}
              variant="outlined"
              size="small"
              color="info"
            >
              Cancel
            </Button>
            
          </Box>
        </DialogContent>
        }
      </Dialog>
    </React.Fragment>
    );
};

export default SendResourceDialog;