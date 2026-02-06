/* eslint-disable react-hooks/exhaustive-deps */
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetFeatureListQuery } from "../../Redux/Slices/applicationDataApiSlice";
import AddFeatureDialog from "../../components/AddFeatureDialog/AddFeatureDialog";
import BackDrop from "../../components/shared/Backdrop/Backdrop";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import FeatureBox from "../../components/ui/User-Access-Conreoll/FeatureBox";
import { COLOR_ClASS } from "../../constants/ColorsClassName";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import useToasterHook from "../../hooks/useToasterHook";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import "../../styles/ManageFeatures.css";
import "../../styles/feature.scss";
import "../../styles/sharedStyles.css";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import { customFetch } from "../StudentTotalQueries/helperFunction";
const ManageFeature = () => {
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const [featureState, setFeatureState] = useState({});
  const pushNotification = useToasterHook();
  const navigate = useNavigate();
  const collegeID = useSelector(
    (state) => state.authentication.currentUserInitialCollege
  );
  const [internalServerError, setInternalServerError] = useState(false);
  const [somethingWentWrong, setSomethingWentWrong] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const {
    data: featureList,
    isSuccess,
    isFetching,
    error,
    isError,
    refetch,
  } = useGetFeatureListQuery({ collegeId: collegeId });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (typeof featureList?.features === "object") {
          setFeatureState(featureList?.features);
          const parent = Object.keys(featureList?.features)[0];
          const child = Object.keys(featureList?.features[parent])[0];
          setFeature({
            parent: parent,
            child: child,
          });
        } else {
          throw new Error("Inbound API response has changed");
        }
      }
      if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(setInternalServerError);
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setSomethingWentWrong);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, isSuccess, featureList]);

  const handleKey = (key) => {
    if (key.includes("_")) {
      return key
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    } else {
      return key.charAt(0).toUpperCase() + key.slice(1);
    }
  };

  const [feature, setFeature] = useState({
    parent: "",
    child: "",
  });
  const handleChange = (e) => {
    setFeature(JSON.parse(e.target.value));
  };

  const updateFeature = () => {
    setUpdating(true);
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/college/features/update/?college_id=${collegeID?.id}`,
      {
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(featureState),
      }
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result?.message) {
          pushNotification("success", result?.message);
          refetch();
        } else if (result?.detail) {
          pushNotification("error", result?.detail);
        }
      })
      .catch((_error) => {
        navigate("/page500");
      })
      .finally((_data) => {
        setUpdating(false);
      });
  };
  const [createFeatureDialogOpen, setCreateFeatureDialogOpen] =
    React.useState(false);
  const handleClickOpen = () => {
    setCreateFeatureDialogOpen(true);
  };

  const handleClose = () => {
    setCreateFeatureDialogOpen(false);
  };
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  useEffect(() => {
    setHeadTitle("Manage Features");
    document.title = "Manage Features";
  }, [headTitle]);
  return (
    <>
      {internalServerError || somethingWentWrong ? (
        <Box
          className="error-animation-box"
          data-testid="error-animation-container"
        >
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
        <Box sx={{ p: 2 }} className="custom-component-container-box">
          <BackDrop openBackdrop={updating} text={"Updating..."}></BackDrop>
          {isFetching ? (
            <Box
              sx={{
                width: "100%",
                minHeight: "50vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LeefLottieAnimationLoader
                height={120}
                width={120}
              ></LeefLottieAnimationLoader>
            </Box>
          ) : (
            <>
              <Card sx={{ height: "100vh" }}>
                <Box
                  sx={{
                    display: "grid",
                    justifyContent: "end",
                    mt: 1,
                    mr: 1,
                  }}
                >
                  <Button onClick={handleClickOpen}>
                    <AddCircleIcon className="create-features-icon" />
                  </Button>
                </Box>
                {Object.keys(featureState).length > 0 ? (
                  <Card sx={{ height: "100vh" }}>
                    <Box sx={{ display: "grid", justifyContent: "sp" }}>
                      <Box sx={{ display: "grid", justifyContent: "center" }}>
                        <FormControl
                          sx={{ m: 2, mb: 3, mt: 2, minWidth: 400 }}
                          size="small"
                        >
                          <InputLabel
                            color="info"
                            htmlFor="grouped-native-select"
                          >
                            Select
                          </InputLabel>
                          <Select
                            native
                            color="info"
                            id="grouped-native-select"
                            labelId="grouped-native-select-label"
                            label="Select"
                            onChange={handleChange}
                            value={JSON.stringify(feature)}
                          >
                            {Object.keys(featureState).map(
                              (featureKeyName, index) => (
                                <optgroup label={handleKey(featureKeyName)}>
                                  {Object.keys(featureState[featureKeyName])
                                    .length > 0 &&
                                    Object.keys(
                                      featureState[featureKeyName]
                                    ).map((featureName, index) => (
                                      <option
                                        value={JSON.stringify({
                                          parent: featureKeyName,
                                          child: featureName,
                                        })}
                                        style={{
                                          fontSize: "16px",
                                        }}
                                      >
                                        {handleKey(featureName)}
                                      </option>
                                    ))}
                                </optgroup>
                              )
                            )}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>

                    {Object.keys(featureState[feature?.parent][feature?.child])
                      .length > 0 ? (
                      <Box>
                        <Box className="main-wrapper">
                          {Object.keys(
                            featureState[feature?.parent][feature?.child]
                          ).map((featureKeyName, index) => (
                            <FeatureBox
                              key={index}
                              colorClassName={COLOR_ClASS[index]}
                              state={featureState}
                              setState={setFeatureState}
                              fieldName={featureKeyName}
                              mappingObject={feature}
                              showName={
                                handleKey(featureKeyName).length < 18
                                  ? handleKey(featureKeyName)
                                  : `${handleKey(featureKeyName).substring(
                                      0,
                                      18
                                    )}..`
                              }
                              toolTip={`You have the option to enable or disable the ${handleKey(
                                featureKeyName
                              )} feature`}
                            ></FeatureBox>
                          ))}
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <button onClick={updateFeature} className="button-33">
                            Save
                          </button>
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          minHeight: "55vh",
                          alignItems: "center",
                        }}
                      >
                        <BaseNotFoundLottieLoader
                          height={250}
                          width={250}
                        ></BaseNotFoundLottieLoader>
                      </Box>
                    )}
                  </Card>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      minHeight: "55vh",
                      alignItems: "center",
                    }}
                  >
                    <BaseNotFoundLottieLoader
                      height={250}
                      width={250}
                    ></BaseNotFoundLottieLoader>
                  </Box>
                )}
              </Card>
            </>
          )}
          {createFeatureDialogOpen && (
            <AddFeatureDialog
              handleClose={handleClose}
              createFeatureDialogOpen={createFeatureDialogOpen}
              refetch={refetch}
            ></AddFeatureDialog>
          )}
        </Box>
      )}{" "}
    </>
  );
};

export default ManageFeature;
