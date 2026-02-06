/* eslint-disable react-hooks/exhaustive-deps */
import { DriveFolderUpload } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import useToasterHook from "../../hooks/useToasterHook";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { useSelector } from "react-redux";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import "../../styles/sharedStyles.css";
const CreateScript = () => {
  const pushNotification = useToasterHook();
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [uploadFiles, setUploadFiles] = useState(null);
  const [widgetURL, setWidgetURL] = useState();
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  //internal error state
  const [uploadFileInternalServerError, setUploadFileInternalServerError] =
    useState(false);
  const [somethingWentWrongInUploadFile, setSomethingWentWrongInUploadFile] =
    useState(false);

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setUploadFiles(null);
    setActiveStep(0);
  };

  const downloadJsFile = () => {
    const element = document.createElement("a");
    const file = new Blob(
      [
        ` document.body.onload = function () {
            var loc = window.location.href;
            var params = loc.split("?")[1];
    
            var iframe = Array.from(document.getElementsByTagName("iframe")).filter(
              (iframe) => iframe.src === '${widgetURL}'
            );
            if(params){
                 iframe.forEach((element) => {
              element.src = element?.src?.toString() + "?" + params;
            });
            }
          };`,
      ],
      {
        type: "text/plain",
      }
    );
    element.href = URL.createObjectURL(file);
    element.download = "widget.js";
    document.body.appendChild(element);
    element.click();
  };
  const [loadSendQueries, setLoadSendQueries] = useState(false);
  const [uploadedJSFileUrl, setUploadedJSFileUrl] = useState(false);
  const handleFileChange = (e, setDoc) => {
    setLoadSendQueries(true);
    setDoc(e.target.files[0]);

    const formData = new FormData();
    formData.append("files", e.target.files[0] ? e.target.files[0] : "");

    const headers = {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    };

    axios
      .post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/upload_files/${
          collegeId ? "?college_id=" + collegeId : ""
        }&feature_key=${getFeatureKeyFromCookie()}`,
        formData,
        {
          headers: headers,
        }
      )
      .then((response) => {
        try {
          if (Array.isArray(response?.data?.data) && response?.status === 200) {
            response?.data?.data[0]?.map((data) =>
              setUploadedJSFileUrl(data?.public_url)
            );
            setLoadSendQueries(false);
            pushNotification("success", "File Uploaded Successfully");
          } else {
            throw new Error("upload_files API response has changed");
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(setSomethingWentWrongInUploadFile, "", 5000);
        }
      })
      .catch((error) => {
        handleInternalServerError(setUploadFileInternalServerError, "", 5000);
      })
      .finally(() => {
        setLoadSendQueries(false);
      });
  };
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //Selection Procedure Head Title add
  useEffect(() => {
    setHeadTitle("Iframe and Script Generator");
    document.title = "Iframe and Script Generator";
  }, [headTitle]);
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, pb: 2 }}
      className="custom-component-container-box"
    >
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadSendQueries}
      >
        <span style={{ fontWeight: "bold", marginRight: "5px" }}>
          Uploading
        </span>
        <CircularProgress color="info" />
      </Backdrop>
      <Container maxWidth={false}>
        <Card sx={{ height: "100%" }}>
          {uploadFileInternalServerError || somethingWentWrongInUploadFile ? (
            <>
              {uploadFileInternalServerError && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {somethingWentWrongInUploadFile && (
                <ErrorFallback
                  error={apiResponseChangeMessage}
                  resetErrorBoundary={() => window.location.reload()}
                />
              )}
            </>
          ) : (
            <CardContent sx={{ p: 0 }}>
              <Box>
                <Stepper
                  sx={{ p: 3 }}
                  activeStep={activeStep}
                  orientation="vertical"
                >
                  <Step>
                    <StepLabel
                      optional={
                        activeStep === 2 ? (
                          <Typography variant="caption">Last step</Typography>
                        ) : null
                      }
                    >
                      Enter Widget URL
                    </StepLabel>
                    <StepContent>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleNext();
                          downloadJsFile();
                        }}
                        action=""
                      >
                        <TextField
                          onChange={(e) => setWidgetURL(e.target.value)}
                          required
                          id="standard-basic"
                          label="url"
                          variant="standard"
                          color="info"
                        />
                        <Box sx={{ mb: 2 }}>
                          <div>
                            <Button
                              size="small"
                              type="submit"
                              variant="contained"
                              sx={{ mt: 1, mr: 1 }}
                            >
                              {activeStep === 2 ? "Finish" : "Continue"}
                            </Button>
                            <Button
                              size="small"
                              disabled={activeStep === 0}
                              onClick={handleBack}
                              sx={{ mt: 1, mr: 1 }}
                            >
                              Back
                            </Button>
                          </div>
                        </Box>
                      </form>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepLabel
                      optional={
                        activeStep === 2 ? (
                          <Typography variant="caption">Last step</Typography>
                        ) : null
                      }
                    >
                      Upload JS File
                    </StepLabel>
                    <StepContent>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleNext();
                        }}
                        action=""
                      >
                        <Box sx={{ mt: 2 }}>
                          <label htmlFor="icon-button-file">
                            <label htmlFor="widget">
                              <input
                                id="widget"
                                type="file"
                                onChange={(e) =>
                                  handleFileChange(e, setUploadFiles)
                                }
                                hidden
                              />
                              <IconButton
                                color="primary"
                                aria-label="upload picture"
                                component="span"
                              >
                                <Typography sx={{ fontSize: "15px" }}>
                                  {" "}
                                  Upload Attachment
                                </Typography>{" "}
                                <DriveFolderUpload />
                              </IconButton>
                              <span className="file-chosen">
                                {uploadFiles
                                  ? uploadFiles?.name
                                  : "No File Chosen"}
                              </span>
                            </label>
                          </label>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <div>
                            <Button
                              size="small"
                              disabled={uploadFiles === null}
                              variant="contained"
                              type="submit"
                              sx={{ mt: 1, mr: 1 }}
                            >
                              {activeStep === 2 ? "Finish" : "Continue"}
                            </Button>
                            <Button
                              size="small"
                              disabled={activeStep === 0}
                              onClick={handleBack}
                              sx={{ mt: 1, mr: 1 }}
                            >
                              Back
                            </Button>
                          </div>
                        </Box>
                      </form>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepLabel
                      optional={
                        activeStep === 2 ? (
                          <Typography variant="caption">Last step</Typography>
                        ) : null
                      }
                    >
                      Iframe + Script
                    </StepLabel>
                    <StepContent>
                      <Box>
                        {`
                        <iframe  height="650px" width='100%'  src="${widgetURL}" frameborder="0"></iframe>
                        `}
                        <br />
                        {` <script  src="${uploadedJSFileUrl}"></script>
                        `}
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <div>
                          <Button
                            size="small"
                            onClick={handleNext}
                            variant="contained"
                            sx={{ mt: 1, mr: 1 }}
                          >
                            {activeStep === 2 ? "Finish" : "Continue"}
                          </Button>
                          <Button
                            size="small"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            Back
                          </Button>
                        </div>
                      </Box>
                    </StepContent>
                  </Step>
                </Stepper>
                {activeStep === 3 && (
                  <Paper square elevation={0} sx={{ p: 3 }}>
                    <Typography>All steps completed </Typography>
                    <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                      Reset
                    </Button>
                  </Paper>
                )}
              </Box>
            </CardContent>
          )}
        </Card>
      </Container>
    </Box>
  );
};

export default CreateScript;
