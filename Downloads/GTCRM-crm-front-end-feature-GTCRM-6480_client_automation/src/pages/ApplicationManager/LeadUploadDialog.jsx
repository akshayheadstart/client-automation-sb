import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetCounselorListQuery,
  useUploadLeadDataMutation,
  useUploadRawDataMutation,
} from "../../Redux/Slices/applicationDataApiSlice";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import useToasterHook from "../../hooks/useToasterHook";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
const LeadUploadDialog = ({
  setOpenUploadLeadDialog,
  openUploadLeadDialog,
  selectedFile,
  setSelectedFile,
  state,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedCounsellor, setSelectedCounsellor] = useState("");
  const [leadDataName, setLeadDataName] = useState("");
  const [skipCounselorApiCall, setSkipCounselorApiCall] = useState(true);
  const [counsellorList, setCounsellorList] = useState([]);
  const [hideCounsellorList, setHideCounsellorList] = useState(false);
  const [internalServerError, setInternalServerError] = useState(false);
  const [somethingWentWrong, setSomethingWentWrong] = useState(false);
  const [loadingUploadLead, setLoadingUploadLead] = useState(false);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const pushNotification = useToasterHook();
  const { handleFilterListApiCall } = useCommonApiCalls();

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

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

  const [uploadLeadData] = useUploadLeadDataMutation();
  const [uploadRawData] = useUploadRawDataMutation();

  const handleUploadLead = (event, mutationFunction) => {
    event.preventDefault();
    setLoadingUploadLead(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    if (import.meta.env.VITE_ACCOUNT_TYPE === "demo") {
      pushNotification("success", `Successfully Selected file Uploaded !`);
      setLoadingUploadLead(false);
      setOpenUploadLeadDialog(false);
      setLeadDataName("");
      setSelectedCounsellor("");
      setSelectedFile("");
    } else {
      mutationFunction({
        formData,
        selectedCounsellor,
        collegeId,
        leadDataName,
      })
        .unwrap()
        .then((res) => {
          if (res?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (res?.message) {
            try {
              if (typeof res?.message === "string") {
                pushNotification("success", res?.message);
                setOpenUploadLeadDialog(false);
                setLeadDataName("");
                setSelectedCounsellor("");
                setSelectedFile("");
              } else {
                throw new Error(
                  `Lead upload with CSV API response has changed`
                );
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(setSomethingWentWrong, "", 5000);
            }
          } else if (res?.detail) {
            pushNotification("error", res?.detail);
          }
        })
        .catch((error) => {
          if (error?.data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (error?.data?.detail) {
            pushNotification("error", error?.data?.detail);
          } else {
            handleInternalServerError(setInternalServerError, "", 5000);
          }
        })
        .finally(() => {
          setLoadingUploadLead(false);
        });
    }
  };

  return (
    <Box>
      <Dialog
        sx={{ m: 3.5 }}
        fullScreen={fullScreen}
        open={openUploadLeadDialog}
        onClose={() => setOpenUploadLeadDialog(false)}
        aria-labelledby="responsive-dialog-title"
      >
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
          <form
            onSubmit={(event) =>
              handleUploadLead(event, state ? uploadLeadData : uploadRawData)
            }
          >
            <Box sx={{ m: 3.5 }}>
              <Typography variant="subtitle2">
                File selected successfully. To continue, enter details.
              </Typography>
              {!hideCounsellorList && state && (
                <Autocomplete
                  loading={counselorListApiCallInfo?.isLoading}
                  onOpen={() => setSkipCounselorApiCall(false)}
                  sx={{ mt: 3 }}
                  fullWidth
                  getOptionLabel={(option) => option.name}
                  options={counsellorList}
                  onChange={(_, value) => setSelectedCounsellor(value?.id)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Assign to Counsellor"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {counselorListApiCallInfo?.isLoading ? (
                              <CircularProgress color="info" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                      color="info"
                    />
                  )}
                />
              )}
              <TextField
                onChange={(e) => setLeadDataName(e.target.value)}
                fullWidth
                sx={{ my: 3 }}
                required
                label="Data Name"
                color="info"
              />

              <DialogActions sx={{ justifyContent: "center", p: 0 }}>
                {loadingUploadLead ? (
                  <CircularProgress size={30} color="info" />
                ) : (
                  <Button
                    variant="contained"
                    className="lead-create-button"
                    type="submit"
                    color="info"
                  >
                    Create
                  </Button>
                )}
              </DialogActions>
            </Box>
          </form>
        )}
      </Dialog>
    </Box>
  );
};

export default LeadUploadDialog;
