import React, { useContext, useEffect, useState } from 'react';
import '../../styles/updateResource.css'
import { Box, Button, IconButton, Typography } from '@mui/material';
import { convertDateFormat } from '../../helperFunctions/filterHelperFunction';
import CloseIcon from "@mui/icons-material/Close";
import { useGetResourceContentDataQuery } from '../../Redux/Slices/filterDataSlice';
import { useSelector } from 'react-redux';
import useToasterHook from '../../hooks/useToasterHook';
import { handleInternalServerError } from '../../utils/handleInternalServerError';
import { handleSomethingWentWrong } from '../../utils/handleSomethingWentWrong';
import { DashboradDataContext } from '../../store/contexts/DashboardDataContext';
import Error500Animation from '../../components/shared/ErrorAnimation/Error500Animation';
import { ErrorFallback } from '../../hooks/ErrorFallback';
import LeefLottieAnimationLoader from '../../components/shared/Loader/LeefLottieAnimationLoader';
import Cookies from 'js-cookie';
const SingleResourceCard = ({indexValue,setIndex,allResourceContentLength,setMessageDrawerOpen,updateId,state,setToggle,handleNextLeadButton,toggle,applicationIndex,somethingWentWrongInResources,updateResourcesOfLocalStorage}) => {
    const collegeId = useSelector(
        (state) => state.authentication.currentUserInitialCollege?.id
      );
      const totalUpdateResourcesTotalCount = JSON.parse(
        localStorage.getItem(`${Cookies.get("userId")}updateResourcesTotalCount`)
      );
      
      const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
      const [getSingleResourceContentInternalServerError, setGetSingleResourceContentInternalServerError] =
    useState(false);
  const [somethingWentWrongInGetSingleResourceContent, setSomethingWentWrongInGetSingleResourceContent] =
    useState(false);
      const pushNotification = useToasterHook();
      const [singleResourceContent,setSingleResourceContent]=useState({})
      const { data, isSuccess, isFetching, error, isError } =
  useGetResourceContentDataQuery({
    collegeId: collegeId,
    updateId:updateId
  });

useEffect(() => {
  try {
    if (isSuccess) {
      if (Array.isArray(data?.data)) {
            setSingleResourceContent(data?.data[0]);
      } else {
        throw new Error("get all Event API response has changed");
      }
    }
    if (isError) {
        setSingleResourceContent({});
      if (error?.data?.detail === "Could not validate credentials") {
        window.location.reload();
      } else if (error?.data?.detail) {
        pushNotification("error", error?.data?.detail);
      }
      if (error?.status === 500) {
        handleInternalServerError(
            setGetSingleResourceContentInternalServerError,
            "",
          10000
        );
      }
    }
  } catch (error) {
    setApiResponseChangeMessage(error);
    handleSomethingWentWrong(
        setSomethingWentWrongInGetSingleResourceContent,
        "",
      10000
    );
  }
  // finally{
  //   setToggle(false)
  // }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isSuccess, data, error, isError]);
    return (
        <>
        {
            somethingWentWrongInGetSingleResourceContent ||
            getSingleResourceContentInternalServerError ||somethingWentWrongInResources ? (
              <>
                {(getSingleResourceContentInternalServerError) && (
                  <Error500Animation height={400} width={400}></Error500Animation>
                )}
                {(somethingWentWrongInGetSingleResourceContent || somethingWentWrongInResources) && (
                  <ErrorFallback
                    error={apiResponseChangeMessage}
                    resetErrorBoundary={() => window.location.reload()}
                  />
                )}
              </>
            ):
            <>
            {

              isFetching ? (
                    <>
                      <Box className="loading-animation">
                        <LeefLottieAnimationLoader
                          height={200}
                          width={180}
                        ></LeefLottieAnimationLoader>
                      </Box>
                    </>
                  ):
                  <Box>
            <Box
              className='update-resource-drawer-header-box'
              >
                <Box sx={{maxWidth:'300px'}}>
                <Typography className='update-resource-title'>{singleResourceContent?.title}</Typography>
                </Box>
                <IconButton>
                <CloseIcon
                  sx={{ cursor: "pointer" }}
                  onClick={() => setMessageDrawerOpen(false)}
                />
                </IconButton>
              </Box>
            <Box className='update-resource-drawer-box-card'>
            <Typography className='update-resource-user-name'>{singleResourceContent?.created_by_name}</Typography>
            <Typography className='update-resource-date-text'>{convertDateFormat(singleResourceContent?.created_at)}</Typography>
            </Box>
            <Box className='update-resource-description-box'>
            <Typography className='update-resource-description'>{singleResourceContent?.content}</Typography>
            </Box>
            <Box className='update-resource-button-box'>
                {
                   toggle&&
            <Button 
            disabled={updateResourcesOfLocalStorage?.length===applicationIndex+1} 
            onClick={()=>handleNextLeadButton()} sx={{borderRadius:50}} 
            className={updateResourcesOfLocalStorage?.length===applicationIndex+1?'next-disabled-button-design':'next-button-design'} 
            // className={'next-button-design'} 
            color='info' variant="contained" size="medium">
          Next
        </Button>
                }
            </Box>
            
        </Box>
            }
            </>
        }
     
        </>
    );
};

export default SingleResourceCard;