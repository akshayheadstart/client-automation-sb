import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  TextField,
} from "@mui/material";
import React from "react";
import BootstrapDialogTitle from "../../components/shared/Dialogs/BootsrapDialogsTitle";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { useEffect } from "react";
import { useGetCounselorListQuery } from "../../Redux/Slices/applicationDataApiSlice";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";

const LeadAssignToCounsellorDialog = ({
  internalServerError,
  somethingWentWrong,
  loadingAssignCounsellor,
  handleCloseDialogs,
  openDialog,
  handleAssignToCounsellor,
  setSelectedCounsellorId,
}) => {
  const [skipCounselorApiCall, setSkipCounselorApiCall] = useState(true);
  const [counsellorList, setCounsellorList] = useState([]);
  const [hideCounsellorList, setHideCounsellorList] = useState(false);
  const { apiResponseChangeMessage } = useContext(DashboradDataContext);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const { handleFilterListApiCall } = useCommonApiCalls();

  const counselorListApiCallInfo = useGetCounselorListQuery(
    { isHoliday: false, collegeId },
    {
      skip: skipCounselorApiCall,
    }
  );

  //get counsellor list
  useEffect(() => {
    if (!skipCounselorApiCall) {
      const counselorList = counselorListApiCallInfo.data?.data[0];
      handleFilterListApiCall(
        counselorList,
        counselorListApiCallInfo,
        setCounsellorList,
        setHideCounsellorList
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipCounselorApiCall, counselorListApiCallInfo]);

  return (
    <Box>
      <Dialog
        onClose={() => {
          handleCloseDialogs();
        }}
        aria-labelledby="customized-dialog-title"
        open={openDialog}
        maxWidth={false}
      >
        <Box
          sx={{
            backgroundColor: "background.paper",
            minHeight: "100%",
            minWidth: "400px",
          }}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={() => {
              handleCloseDialogs();
            }}
          >
            Assign Leads to Counsellor
          </BootstrapDialogTitle>
          {internalServerError || somethingWentWrong ? (
            <Box>
              {internalServerError && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {somethingWentWrong && (
                <ErrorFallback
                  error={apiResponseChangeMessage}
                  resetErrorBoundary={() => window.location.reload()}
                />
              )}
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  pb: 3,
                  pt: 2,
                  px: 2,
                }}
              >
                <form onSubmit={handleAssignToCounsellor}>
                  {!hideCounsellorList && (
                    <Autocomplete
                      onOpen={() => {
                        setSkipCounselorApiCall(false);
                      }}
                      getOptionLabel={(option) =>
                        option?.label ? option?.label : option?.name
                      }
                      options={counsellorList}
                      onChange={(_, newValue) => {
                        setSelectedCounsellorId(newValue?.id);
                      }}
                      id="combo-box-demo"
                      loading={counselorListApiCallInfo.isFetching}
                      renderInput={(params) => (
                        <TextField
                          color="info"
                          fullWidth
                          required
                          {...params}
                          label="Select Counselor"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {counselorListApiCallInfo.isFetching ? (
                                  <CircularProgress color="info" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  )}

                  <Box sx={{ mt: 3 }}>
                    {loadingAssignCounsellor ? (
                      <CircularProgress size={30} color="info" />
                    ) : (
                      <Button type="submit" variant="contained" size="small">
                        Save
                      </Button>
                    )}
                  </Box>
                </form>
              </Box>
            </>
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default LeadAssignToCounsellorDialog;
