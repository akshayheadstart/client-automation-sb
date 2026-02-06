//Add Menu, features or sub features dialog box
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  CircularProgress,
  DialogContent,
  Fab,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useContext, useEffect, useState } from "react";
import { Input, TreePicker } from "rsuite";
import "../../styles/ManageFeatures.css";
import { useSelector } from "react-redux";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import Cookies from "js-cookie";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { useNavigate } from "react-router-dom";
import {
  findKeysInAllFeatures,
  findParentKey,
  modifyKeysWithUnderscores,
  removeUnderlineAndJoin,
} from "../../helperFunctions/calendarHelperfunction";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CustomTooltip from "../shared/Popover/Tooltip";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import useToasterHook from "../../hooks/useToasterHook";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import CloseIcon from "@mui/icons-material/Close";
import "../../styles/userPermission.css";
import "../../styles/addFeatureDialog.css";
import "../../styles/sharedStyles.css";
import IconButton from "@mui/material/IconButton";
import AddFeatureTutorial from "../ui/User-Access-Conreoll/AddFeatureTutorial";
import SpinnerIcon from "@rsuite/icons/legacy/Spinner";
const AddFeatureDialog = ({
  handleClose,
  createFeatureDialogOpen,
  refetch,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  // const [menuToggle, setMenuToggle] = useState(false);
  // const [featureToggle, setFeatureToggle] = useState(false);
  // const [subFeatureToggle, setSubFeatureToggle] = useState(false);
  const [toggle, setToggle] = useState(true);
  // const [existsMenuToggle, setExistsMenuToggle] = useState(false);
  // const [subButtonMenuToggle, setSubButtonMenuToggle] = useState(false);
  const [featureButtonToggle, setFeatureButtonToggle] = useState(false);
  // const [existingsubButtonMenuToggle, setExitingSubButtonMenuToggle] =
  //   useState(false);
  const [existingFeatureSubmitToggle, setExistingFeatureSubmitToggle] =
    useState(false);
  // const [newFeatureSubmitToggle, setNewFeatureSubmitToggle] = useState(false);
  // const [existingSubMenuFeatureToggle, setExistingSubMenuFeatureToggle] =
  //   useState(false);
  const [featureName, setFeatureName] = useState("");
  const [allFeatureName, setAllFeatureName] = useState([]);
  const [submenuSelect, setSubmenuSelect] = useState("");
  // const [menuSelect, setSelectMenu] = useState("");
  // const [newSubMenuName, setNewSubMenuName] = useState("");
  // const [newMenuName, setNewMenuName] = useState("");
  // const [newNewSubMenuName, setNewNewSubMenuName] = useState("");
  const [parentKeyName, setParentKeyName] = useState("");
  const styles = { width: 300, marginBottom: 2, textAlign: "center" };
  const resultObject = allFeatureName?.reduce((obj, item) => {
    obj[item] = false;
    return obj;
  }, {});
  const payload = {
    [parentKeyName]: {
      [submenuSelect]: modifyKeysWithUnderscores(resultObject),
    },
  };
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();
  const [allData, setAllData] = useState({});
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [
    somethingWentWrongInUserPermission,
    setSomethingWentWrongInUserPermission,
  ] = useState(false);
  const [hideUserPermission, setHideUserPermission] = useState(false);
  const navigate = useNavigate();
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (loading) {
      fetch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/get_user_permission`,
        ApiCallHeaderAndBody(token, "GET")
      )
        .then((res) => res.json())
        .then((result) => {
          if (result.detail === "Could not validate credentials") {
          } else if (result.data) {
            try {
              if (Array.isArray(result.data)) {
                if (result?.data[0]) {
                  setAllData(result?.data[0]?.menus);
                }

                // setPermissionTreeNodeData(permissionNodeData);
              } else {
                throw new Error(
                  "get_all_menu_and_permission API response has changed"
                );
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setSomethingWentWrongInUserPermission,
                setHideUserPermission,
                10000
              );
            }
          } else if (result.detail) {
            pushNotification("error", result.detail);
          }
        })
        .catch((error) => {
          navigate("/page500");
        })
        .finally(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);
  // const formatDataForTreePicker = (data) => {
  //   return Object.entries(data)
  //     .filter(
  //       ([key, value]) =>
  //         typeof value === "object" && Object.keys(value).length > 0
  //     )
  //     .map(([key, value]) => ({
  //       label: key,
  //       value: key,
  //     }));
  // };
  const formatDataForChildTreePicker = (data) => {
    const childNodes = Object.entries(data).flatMap(([key, value]) => {
      if (typeof value === "object" && Object.keys(value).length > 0) {
        return Object.entries(value).map(([childKey]) => ({
          label: removeUnderlineAndJoin(childKey),
          value: childKey,
        }));
      }
      return [];
    });

    return childNodes;
  };

  const formattedChildData = formatDataForChildTreePicker(allData);
  // const formattedParentData = formatDataForTreePicker(allData);

  const handleChangeFeature = () => {
    if (allFeatureName.length > 0) {
      setAllFeatureName([...allFeatureName, featureName]);
    } else {
      setAllFeatureName([featureName]);
    }
  };
  const handleRemoveFeature = (index) => {
    const updatedArray = allFeatureName.filter((item, i) => i !== index);
    setAllFeatureName(updatedArray);
  };
  const [allFeatures, setAllFeatures] = useState([]);
  const [somethingWentWrongInAllFeature, setSomethingWentWrongInAllFeature] =
    useState(false);
  const [hideUserAllFeature, setHideAllFeature] = useState(false);

  useEffect(() => {
    fetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/college/features/?college_id=${collegeId}`,
      ApiCallHeaderAndBody(token, "GET")
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result) {
          // setLoading(false);
          try {
            if (typeof result === "object" && result !== null) {
              const findFeatures = findKeysInAllFeatures(
                result?.features,
                submenuSelect
              );
              setAllFeatures(findFeatures);
              if (submenuSelect) {
                const findParentDataKey = findParentKey(allData, submenuSelect);
                setParentKeyName(findParentDataKey);
              }
            } else {
              throw new Error("get_all_Feature API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInAllFeature,
              setHideAllFeature,
              10000
            );
          }
        } else if (result.detail) {
          // setLoading(false);
        }
      })
      .catch((error) => {
        // setLoading(false);
        // navigate("/page500");
      })
      .finally(() => {
        // setLoading(false)
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submenuSelect]);
  const [
    somethingWentWrongInSubmitFeature,
    setSomethingWentWrongSubmitFeature,
  ] = useState(false);
  const [
    submitFeatureInternalServerError,
    setSubmitFeatureInternalServerError,
  ] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const handleSubmitFeature = () => {
    setSubmitLoading(true);
    fetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/college/features/update/?college_id=${collegeId}`,
      ApiCallHeaderAndBody(token, "PUT", JSON.stringify(payload))
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result.detail) {
          pushNotification("error", result.detail);
        } else {
          try {
            pushNotification("success", "Successfully Create Feature");
            handleClose();
            setFeatureName("");
            setSubmenuSelect("");
            setAllFeatureName([]);
            setLoading(true);
            refetch();
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongSubmitFeature,
              "",
              5000
            );
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(
          setSubmitFeatureInternalServerError,
          "",
          5000
        );
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };
  const [openTutorialDialog, setOpenTutorialDialog] = React.useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const STEPS = ["Step 1", "Step 2", "Step 3"];

  const handleNextStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBackStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={createFeatureDialogOpen}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        {somethingWentWrongInUserPermission ||
        hideUserPermission ||
        hideUserAllFeature ||
        somethingWentWrongInAllFeature ||
        somethingWentWrongInSubmitFeature ||
        submitFeatureInternalServerError ? (
          <Box>
            {(hideUserPermission ||
              hideUserAllFeature ||
              submitFeatureInternalServerError) && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {(somethingWentWrongInUserPermission ||
              somethingWentWrongInAllFeature ||
              somethingWentWrongInSubmitFeature) && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </Box>
        ) : (
          <DialogContent sx={{ p: 0 }} className="vertical-scrollbar">
            <Box className="close-button-Add-feature-dialog-box">
              <IconButton>
                <CloseIcon onClick={() => handleClose()} />
              </IconButton>
            </Box>
            {submitLoading && (
              <Box sx={{ display: "grid", placeItems: "center", my: "5px" }}>
                <CircularProgress color="info" />
              </Box>
            )}
            <Stepper
              className="add-feature-stepper-design-container"
              activeStep={activeStep}
            >
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
            <Box className="area">
              {/* <ul className="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
            </ul> */}
              {/* {
            submitLoading &&
          <Box sx={{display:'grid',placeItems:'center'}}>
          <CircularProgress />
          </Box>
          } */}
              {/* {existsMenuToggle && (
            <Box
              className={`box ${existsMenuToggle ? "visible" : "hidden"}`}
              sx={{
                transform: existsMenuToggle
                  ? "translateX(0)"
                  : "translateX(-100%)",
                opacity: existsMenuToggle ? 1 : 0,
                transition:
                  "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // Center align child elements horizontally
                justifyContent: "center",
              }}
            >
              <ArrowBackIcon
                onClick={() => {
                  setToggle(true);
                  setExistsMenuToggle(false);
                }}
                sx={{borderRadius: 50}}
                className="add-feature-arrow-back"
              />
              <Typography
                style={{ whiteSpace: "nowrap" }}
                variant="body2"
                sx={{
                  textAlign: "center",
                  fontWeight: 800,
                  marginTop: 5,
                  marginBottom: 2,
                  fontSize: 17,
                }}
              >
                Which option do you want to work on?
              </Typography>
              <Box className="addFeatures-button-container">
                <Button
                  onClick={() => {
                    setSubButtonMenuToggle(true);
                    setExistsMenuToggle(false);
                  }}
                  sx={{
                    boxShadow: "0 5px 5px #3c3c3c42",
                    bgcolor: "#146eb4",
                    borderRadius: 50,
                    height: 32,
                    whiteSpace: "nowrap",
                  }}
                  autoFocus
                  className="addFeatures-button-custom-design"
                  variant="contained"
                  size="medium"
                >
                  Sub Menu
                </Button>
                <Button
                  onClick={() => {
                    setExistsMenuToggle(false);
                    setFeatureButtonToggle(true);
                  }}
                  sx={{
                    boxShadow: "0 5px 5px #3c3c3c42",
                    bgcolor: "#02CCFE",
                    borderRadius: 50,
                    height: 32,
                    paddingX: 3.8,
                  }}
                  autoFocus
                  className="addFeatures-button-custom-design"
                  variant="contained"
                  size="medium"
                >
                  {"Feature"}
                </Button>
              </Box>
            </Box>
          )} */}
              {/* {subButtonMenuToggle && (
            <Box
              className={`box ${subButtonMenuToggle ? "visible" : "hidden"}`}
              sx={{
                transform: subButtonMenuToggle
                  ? "translateX(0)"
                  : "translateX(-100%)",
                opacity: subButtonMenuToggle ? 1 : 0,
                transition:
                  "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // Center align child elements horizontally
                // justifyContent: "center",
              }}
            >
              <Typography
                style={{ whiteSpace: "nowrap" }}
                variant="body2"
                sx={{
                  display: "flex",
                  gap: 2,
                  fontWeight: 800,
                  marginTop: 5,
                  marginBottom: 1,
                  fontSize: 17,
                  justifyContent: "center",
                  alignItems: "center",
                  ml: -4,
                }}
              >
                <Typography
                  sx={{
                    border: "1px solid #146eb4",
                    display: "grid",
                    borderRadius: 50,
                    width: 25,
                    height: 25,
                    placeItems: "center",
                    fontWeight: 800,
                    color: "#146eb4",
                  }}
                >
                  1
                </Typography>
                <Typography sx={{ fontWeight: 800, fontSize: 17 }}>
                  Please Select your Menu?
                </Typography>
              </Typography>
              <Box sx={{ textAlign: "center", mt: 1 }}>
                <TreePicker
                  size="lg"
                  placeholder="Menu"
                  data={formattedParentData}
                  style={styles}
                  onChange={(e) => setSelectMenu(e)}
                  required
                  value={menuSelect}
                />
              </Box>
              <Typography
                style={{ whiteSpace: "nowrap" }}
                variant="body2"
                sx={{
                  display: "flex",
                  gap: 2,
                  fontWeight: 800,
                  marginTop: 5,
                  marginBottom: 1,
                  fontSize: 17,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    border: "1px solid #146eb4",
                    display: "grid",
                    borderRadius: 50,
                    width: 25,
                    height: 25,
                    placeItems: "center",
                    fontWeight: 800,
                    color: "#146eb4",
                  }}
                >
                  2
                </Typography>
                <Typography sx={{ fontWeight: 800, fontSize: 17 }}>
                  What is your Sub Menu name?
                </Typography>
              </Typography>

              <Box sx={{ textAlign: "center", mt: 1 }}>
                <Input
                  size="md"
                  placeholder="Add Sub Menu"
                  onChange={(e) => setNewSubMenuName(e)}
                  style={{ width: 300 }}
                  required
                  value={newSubMenuName}
                />
              </Box>
              {newSubMenuName.length > 20 ? (
                <Typography sx={{ fontSize: "13px", color: "#fd5c63", mt: 1 }}>
                  Maximum length 20
                </Typography>
              ) : (
                ""
              )}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 5,
                  mt: 4,
                  alignItems: "center",
                }}
              >
                <Button
                  data-testid="button-back-items"
                  sx={{
                    boxShadow: "0 5px 5px #3c3c3c42",
                    backgroundColor: "white",
                    borderRadius: 50,
                    height: 32,
                    fontSize: 13,
                  }}
                  onClick={() => {
                    setSubButtonMenuToggle(false);
                    setExistsMenuToggle(true);
                  }}
                  size="small"
                  color="info"
                  variant="outlined"
                  startIcon={
                    <ArrowBackIosNewOutlinedIcon
                      sx={{ height: 15, mb: "1px" }}
                    />
                  }
                >
                  Back
                </Button>
                <Button
                  sx={{
                    boxShadow: "0 5px 5px #3c3c3c42",
                    backgroundColor: "white",
                    borderRadius: 50,
                    height: 32,
                    fontSize: 13,
                  }}
                  onClick={() => {
                    setExistingSubMenuFeatureToggle(true);
                    setSubButtonMenuToggle(false);
                  }}
                  size="small"
                  color="info"
                  variant="outlined"
                  endIcon={
                    <ArrowForwardIosOutlinedIcon
                      sx={{ height: 15, mb: "1px" }}
                    />
                  }
                  disabled={
                    !newSubMenuName || !menuSelect || newSubMenuName.length > 20
                  }
                >
                  Next
                </Button>
              </Box>
            </Box>
          )} */}
              {/* {existingSubMenuFeatureToggle && (
            <Box
              className={`box ${
                existingSubMenuFeatureToggle ? "visible" : "hidden"
              }`}
              sx={{
                transform: existingSubMenuFeatureToggle
                  ? "translateX(0)"
                  : "translateX(-100%)",
                opacity: existingSubMenuFeatureToggle ? 1 : 0,
                transition:
                  "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // Center align child elements horizontally
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  display: "flex",
                  gap: 2,
                  fontSize: "17px",
                  whiteSpace: "nowrap",
                  justifyContent: "center",
                  alignItems: "center",
                  ml: -3,
                  marginY: 2,
                }}
                id="responsive-dialog-title"
              >
                <Typography
                  sx={{
                    border: "1px solid #146eb4",
                    display: "grid",
                    borderRadius: 50,
                    width: 25,
                    height: 25,
                    placeItems: "center",
                    fontWeight: 800,
                    color: "#146eb4",
                  }}
                >
                  3
                </Typography>
                <Typography sx={{ fontWeight: 800, fontSize: 17 }}>
                  What is your Feature name?
                </Typography>
              </Typography>
              <Box sx={{ marginY: 1 }}>
                {allFeatureName.length > 0
                  ? allFeatureName?.map((feature, index) => {
                      return (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Input
                            readOnly
                            size="md"
                            placeholder="Add Feature"
                            value={feature}
                            style={{ width: 260, pb: 1 }}
                          />
                          <DeleteIcon
                            onClick={() => handleRemoveFeature(index)}
                            sx={{ color: "#fd5c63", fontSize: 30 }}
                          />
                        </Box>
                      );
                    })
                  : ""}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Input
                  size="md"
                  placeholder="Add Feature"
                  onChange={(e) => setFeatureName(e)}
                  style={{ width: 260 }}
                  value={featureName}
                />
                {featureName.length > 20 ? (
                  <ControlPointIcon
                    sx={{
                      fontSize: 30,
                      color: "#caccd1",
                      cursor: "not-allowed",
                    }}
                  />
                ) : (
                  <ControlPointIcon
                    onClick={() => handleChangeFeature()}
                    sx={{ fontSize: 30, color: "#146eb4", cursor: "pointer" }}
                  />
                )}
              </Box>
              {featureName.length > 20 ? (
                <Typography sx={{ fontSize: "13px", color: "#fd5c63", mt: 1 }}>
                  Maximum length 20
                </Typography>
              ) : (
                ""
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 5,
                  mt: 4,
                }}
              >
                <Button
                  onClick={() => {
                    setSubButtonMenuToggle(true);
                    setExistingSubMenuFeatureToggle(false);
                  }}
                  size="small"
                  color="info"
                  variant="outlined"
                  sx={{
                    boxShadow: "0 5px 5px #3c3c3c42",
                    backgroundColor: "white",
                    borderRadius: 50,
                    height: 32,
                    fontSize: 13,
                  }}
                  startIcon={
                    <ArrowBackIosNewOutlinedIcon
                      sx={{ height: 15, mb: "1px" }}
                    />
                  }
                >
                  Back
                </Button>
                <Button
                  sx={{
                    boxShadow: "0 5px 5px #3c3c3c42",
                    backgroundColor: "white",
                    borderRadius: 50,
                    height: 32,
                    fontSize: 13,
                  }}
                  onClick={() => {
                    setExitingSubButtonMenuToggle(true);
                    setExistingSubMenuFeatureToggle(false);
                  }}
                  size="small"
                  color="info"
                  variant="outlined"
                  endIcon={
                    <ArrowForwardIosOutlinedIcon
                      sx={{ height: 15, mb: "1px" }}
                    />
                  }
                >
                  Next
                </Button>
              </Box>
            </Box>
          )} */}
              {/* {existingsubButtonMenuToggle && (
            <Box
              className={`box ${
                existingsubButtonMenuToggle ? "visible" : "hidden"
              }`}
              sx={{
                transform: existingsubButtonMenuToggle
                  ? "translateX(0)"
                  : "translateX(-100%)",
                opacity: existingsubButtonMenuToggle ? 1 : 0,
                transition:
                  "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // Center align child elements horizontally
                justifyContent: "center",
              }}
            >
              <Box sx={{ backgroundColor: "#C6FCFF", p: 4, borderRadius: 2 }}>
                <Typography
                  style={{ whiteSpace: "nowrap" }}
                  variant="body2"
                  sx={{
                    textAlign: "center",
                    fontWeight: 800,
                    marginTop: 5,
                    marginBottom: 1,
                    fontSize: 17,
                  }}
                >
                  Your Selected Menu
                </Typography>
                <Box sx={{ textAlign: "center" }}>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    value={menuSelect ? menuSelect : "N/A"}
                    sx={{
                      backgroundColor: "#87CEEB",
                      borderRadius: 1,
                      width: 300,
                      fontWeight: 800,
                    }}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                  />
                  <Typography
                    style={{ whiteSpace: "nowrap" }}
                    variant="body2"
                    sx={{
                      textAlign: "center",
                      fontWeight: 800,
                      marginTop: 5,
                      marginBottom: 1,
                      fontSize: 17,
                    }}
                  >
                    Your Sub Menu
                  </Typography>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    value={newSubMenuName ? newSubMenuName : "N/A"}
                    sx={{
                      backgroundColor: "white",
                      borderRadius: 1,
                      boxShadow: "rgba(10, 157, 37, 0.16) 0px 2px 2px",
                      width: 300,
                    }}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                  />
                </Box>
                <Typography
                  style={{ whiteSpace: "nowrap" }}
                  variant="body2"
                  sx={{
                    textAlign: "center",
                    fontWeight: 800,
                    marginTop: 5,
                    marginBottom: 1,
                    fontSize: 17,
                  }}
                >
                  New Feature list
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center", // Center align child elements horizontally
                    justifyContent: "center",
                  }}
                >
                  {allFeatureName.length > 0 ? (
                    allFeatureName?.map((feature) => {
                      return (
                        <TextField
                          size="small"
                          id="outlined-basic"
                          value={feature}
                          sx={{
                            backgroundColor: "white",
                            borderRadius: 1,
                            boxShadow: "rgba(10, 157, 37, 0.16) 0px 2px 2px",
                            width: 300,
                          }}
                          InputProps={{
                            readOnly: true,
                          }}
                          variant="outlined"
                        />
                      );
                    })
                  ) : (
                    <TextField
                      size="small"
                      id="outlined-basic"
                      value="N/A"
                      sx={{
                        backgroundColor: "white",
                        borderRadius: 1,
                        boxShadow: "rgba(10, 157, 37, 0.16) 0px 2px 2px",
                        width: 300,
                      }}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="outlined"
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 5,
                    mt: 3,
                    pb: 1,
                  }}
                >
                  <Button
                    onClick={() => {
                      setExistingSubMenuFeatureToggle(true);
                      setExitingSubButtonMenuToggle(false);
                    }}
                    size="small"
                    color="info"
                    variant="outlined"
                    sx={{
                      boxShadow: "0 5px 5px #3c3c3c42",
                      backgroundColor: "white",
                      borderRadius: 50,
                      height: 32,
                      fontSize: 13,
                      paddingX: 3,
                    }}
                    startIcon={
                      <ArrowBackIosNewOutlinedIcon
                        sx={{ height: 15, mb: "1px" }}
                      />
                    }
                  >
                    Back
                  </Button>
                  <Button
                  onClick={()=>handleSubmitFeature()}
                    sx={{
                      boxShadow: "0 5px 5px #3c3c3c42",
                      borderRadius: 50,
                      height: 32,
                    }}
                    autoFocus
                    variant="contained"
                    size="small"
                    color="info"
                    endIcon={<ArrowUpwardIcon />}
                  >
                    Submit
                  </Button>
                </Box>
              </Box>
            </Box>
          )} */}
              {featureButtonToggle && (
                <Box
                  className={`add-feature-page-box-container ${
                    featureButtonToggle ? "visible" : "hidden"
                  }`}
                  sx={{
                    transform: featureButtonToggle
                      ? "translateX(0)"
                      : "translateX(-100%)",
                    opacity: featureButtonToggle ? 1 : 0,
                  }}
                >
                  <Typography
                    style={{ whiteSpace: "nowrap" }}
                    variant="body2"
                    className="add-feature-dialog-header-text-container"
                  >
                    <Typography
                      sx={{ borderRadius: 50 }}
                      className="add-feature-dialog-point-step"
                    >
                      1
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: "17px" }}>
                      Please Select your Sub Menu?
                    </Typography>
                  </Typography>
                  <Box sx={{ textAlign: "center", mt: 1 }}>
                    {/* update code is here */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <TreePicker
                        size="lg"
                        placeholder="Menu"
                        data={formattedChildData}
                        style={styles}
                        onChange={(e) => {
                          setSubmenuSelect(e);
                          setAllFeatures([]);
                        }}
                        value={submenuSelect}
                        renderMenu={(menu) => {
                          if (loading) {
                            return (
                              <p
                                style={{
                                  padding: 10,
                                  color: "#999",
                                  textAlign: "center",
                                }}
                              >
                                <SpinnerIcon spin /> Loading...
                              </p>
                            );
                          }
                          return menu;
                        }}
                        onOpen={() => {
                          setLoading(true);
                        }}
                      />
                      {submenuSelect ? (
                        <CustomTooltip
                          title={`Existing Features:`}
                          description={
                            <div>
                              {" "}
                              <ul>
                                {" "}
                                {Object.keys(allFeatures).length > 0 ? (
                                  <>
                                    {allFeatures?.map((feature) => {
                                      return (
                                        <li>
                                          {removeUnderlineAndJoin(feature)}
                                        </li>
                                      );
                                    })}
                                  </>
                                ) : (
                                  <li>Feature Not Found</li>
                                )}
                              </ul>{" "}
                            </div>
                          }
                          component={
                            <InfoOutlinedIcon sx={{ color: "#146eb4" }} />
                          }
                        />
                      ) : (
                        ""
                      )}
                    </Box>
                  </Box>
                  <Typography
                    style={{ whiteSpace: "nowrap" }}
                    variant="body2"
                    className="add-feature-dialog-new-feature-name-text-container"
                  >
                    <Typography
                      sx={{ borderRadius: 50 }}
                      className="add-feature-dialog-point-step"
                    >
                      2
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: "17px" }}>
                      What is your Feature name?
                    </Typography>
                  </Typography>
                  <Box className="add-new-feature-delete-box-container">
                    {allFeatureName.length > 0
                      ? allFeatureName?.map((feature, index) => {
                          return (
                            <>
                              <Box className="add-feature-show-new-feature-container">
                                <Input
                                  readOnly
                                  size="md"
                                  placeholder="Add Feature"
                                  value={feature}
                                  style={{ width: 260, pb: 1 }}
                                />
                                <DeleteIcon
                                  onClick={() => handleRemoveFeature(index)}
                                  sx={{ color: "#fd5c63", fontSize: 30 }}
                                />
                              </Box>
                            </>
                          );
                        })
                      : ""}
                  </Box>

                  <Box className="add-feature-show-new-feature-container">
                    <Input
                      size="md"
                      placeholder="Add Feature"
                      onChange={(e) => setFeatureName(e)}
                      style={{ width: 260 }}
                      value={featureName}
                      disabled={!submenuSelect}
                    />
                    {featureName.length < 2 || featureName.length > 20 ? (
                      <ControlPointIcon
                        sx={{
                          fontSize: 30,
                          color: "#caccd1",
                          cursor: "not-allowed",
                        }}
                      />
                    ) : (
                      <ControlPointIcon
                        onClick={() => {
                          handleChangeFeature();
                          setFeatureName("");
                        }}
                        sx={{
                          fontSize: 30,
                          color: "#146eb4",
                          cursor: "pointer",
                        }}
                      />
                    )}
                  </Box>
                  {featureName.length > 20 ? (
                    <Typography
                      sx={{ fontSize: "13px", color: "#fd5c63", mt: 1 }}
                    >
                      Maximum new feature name text length 20
                    </Typography>
                  ) : (
                    ""
                  )}
                  {featureName.length === 1 ? (
                    <Typography
                      sx={{ fontSize: "13px", color: "#fd5c63", mt: 1 }}
                    >
                      Minimum new feature name text length 2
                    </Typography>
                  ) : (
                    ""
                  )}
                  <Box className="add-feature-button-box-container">
                    <Button
                      data-testid="button-back-items"
                      sx={{ borderRadius: "10px" }}
                      className="addFeatures-button-custom-design"
                      onClick={() => {
                        setFeatureButtonToggle(false);
                        setToggle(true);
                        handleBackStep();
                      }}
                      size="small"
                      variant="contained"
                      startIcon={
                        <ArrowBackIosNewOutlinedIcon sx={{ height: 15 }} />
                      }
                    >
                      Back
                    </Button>
                    <Button
                      sx={{ borderRadius: "10px" }}
                      className={
                        submenuSelect && allFeatureName.length > 0
                          ? "addFeatures-button-custom-design"
                          : "add-feature-back-button"
                      }
                      onClick={() => {
                        setExistingFeatureSubmitToggle(true);
                        setFeatureButtonToggle(false);
                        handleNextStep();
                      }}
                      size="small"
                      variant="contained"
                      endIcon={
                        <ArrowForwardIosOutlinedIcon sx={{ height: 15 }} />
                      }
                      disabled={!submenuSelect || !allFeatureName.length > 0}
                    >
                      Next
                    </Button>
                  </Box>
                </Box>
              )}
              {existingFeatureSubmitToggle && (
                <Box
                  className={`add-feature-page-box-container ${
                    existingFeatureSubmitToggle ? "visible" : "hidden"
                  }`}
                  sx={{
                    transform: existingFeatureSubmitToggle
                      ? "translateX(0)"
                      : "translateX(-100%)",
                    opacity: existingFeatureSubmitToggle ? 1 : 0,
                  }}
                >
                  <Box className="add-feature-submit-design-box-container">
                    <Typography
                      style={{ whiteSpace: "nowrap" }}
                      variant="body2"
                      className="add-feature-selected-sub-menu-text"
                    >
                      Your Selected Sub Menu
                    </Typography>
                    <Box sx={{ textAlign: "center" }}>
                      <TextField
                        size="small"
                        id="outlined-basic"
                        value={submenuSelect ? submenuSelect : "N/A"}
                        sx={{
                          backgroundColor: "#E4F5FF",
                          borderRadius: 1,
                          width: 300,
                          fontWeight: 800,
                        }}
                        InputProps={{
                          readOnly: true,
                        }}
                        variant="outlined"
                        color="info"
                      />
                      <Typography
                        style={{ whiteSpace: "nowrap" }}
                        variant="body2"
                        className="add-feature-selected-sub-menu-text"
                      >
                        New Feature list
                      </Typography>
                      <Box className="add-feature-show-all-new-feature-container">
                        {allFeatureName.length > 0 ? (
                          allFeatureName?.map((feature) => {
                            return (
                              <TextField
                                size="small"
                                id="outlined-basic"
                                value={feature}
                                sx={{
                                  width: 300,
                                  backgroundColor: "#fff",
                                  mt: "5px",
                                  border: 0,
                                }}
                                className="add-feature-all-feature-name-field"
                                InputProps={{
                                  readOnly: true,
                                }}
                                color="info"
                                variant="outlined"
                              />
                            );
                          })
                        ) : (
                          <TextField
                            size="small"
                            id="outlined-basic"
                            color="info"
                            value="N/A"
                            sx={{
                              width: 300,
                            }}
                            className="add-feature-all-feature-name-field"
                            InputProps={{
                              readOnly: true,
                            }}
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                    <Box className="add-feature-submit-box-container">
                      <Button
                        onClick={() => {
                          setFeatureButtonToggle(true);
                          setExistingFeatureSubmitToggle(false);
                          handleBackStep();
                        }}
                        size="small"
                        variant="contained"
                        sx={{ borderRadius: "10px" }}
                        className="addFeatures-button-custom-design"
                        startIcon={
                          <ArrowBackIosNewOutlinedIcon sx={{ height: 15 }} />
                        }
                      >
                        Back
                      </Button>
                      <Button
                        onClick={() => handleSubmitFeature()}
                        sx={{
                          borderRadius: "10px",
                          height: 32,
                        }}
                        autoFocus
                        variant="contained"
                        size="small"
                        endIcon={<ArrowUpwardIcon />}
                        className="add-features-submit-button-design"
                      >
                        Submit
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
              {toggle && (
                <Box
                  className={`add-feature-page-box-container ${
                    toggle ? "visible" : "hidden"
                  }`}
                  sx={{
                    transform: toggle ? "translateX(0)" : "translateX(-100%)",
                    opacity: toggle ? 1 : 0,
                  }}
                >
                  <DialogTitle
                    className="add-feature-title-text"
                    id="responsive-dialog-title"
                  >
                    {/* {"Add Menu | Sub Menu | Feature"} */}
                    {"Add Feature"}
                  </DialogTitle>
                  <Box>
                    {/* <DialogTitle
                  sx={{
                    textAlign: "center",
                    fontSize: "17px",
                    whiteSpace: "nowrap",
                  }}
                  id="responsive-dialog-title"
                >
                  {"Which option do you want to work on?"}
                </DialogTitle> */}
                    <Box className="addFeatures-button-container">
                      {/* <Button
                    onClick={() => {
                      setToggle(false);
                      setExistsMenuToggle(true);
                    }}
                    sx={{
                      boxShadow: "0 5px 5px #3c3c3c42",
                      bgcolor: "#146eb4",
                      borderRadius: 50,
                      height: 32,
                    }}
                    autoFocus
                    className="addFeatures-button-custom-design"
                    variant="contained"
                    size="medium"
                  >
                    Existing
                  </Button>
                  <Button
                    onClick={() => {
                      setToggle(false);
                      setMenuToggle(true);
                    }}
                    sx={{
                      boxShadow: "0 5px 5px #3c3c3c42",
                      bgcolor: "#02CCFE",
                      borderRadius: 50,
                      height: 32,
                      paddingX: 3.8,
                    }}
                    autoFocus
                    className="addFeatures-button-custom-design"
                    variant="contained"
                    size="medium"
                  >
                    {"New"}
                  </Button> */}
                      <Button
                        onClick={() => {
                          setToggle(false);
                          // setExistsMenuToggle(false);
                          setFeatureButtonToggle(true);
                          handleNextStep();
                        }}
                        sx={{
                          borderRadius: "10px",
                          paddingX: 3.8,
                        }}
                        autoFocus
                        className="addFeatures-button-custom-design"
                        variant="contained"
                        size="medium"
                      >
                        {"Feature"}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
              {/* {menuToggle && (
            <Box
              className={`box ${menuToggle ? "visible" : "hidden"}`}
              sx={{
                transform: menuToggle ? "translateX(0)" : "translateX(-100%)",
                opacity: menuToggle ? 1 : 0,
                transition:
                  "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // Center align child elements horizontally
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  display: "flex",
                  fontSize: "17px",
                  gap: 2,
                  justifyContent: "center",
                  alignItems: "center",
                  marginY: 2,
                }}
                id="responsive-dialog-title"
              >
                <Typography
                  sx={{
                    border: "1px solid #146eb4",
                    display: "grid",
                    borderRadius: 50,
                    width: 25,
                    height: 25,
                    placeItems: "center",
                    fontWeight: 800,
                    color: "#146eb4",
                  }}
                >
                  1
                </Typography>
                <Typography sx={{ fontWeight: 800, fontSize: 17 }}>
                  What is your Menu name?
                </Typography>
              </Typography>
              <Box sx={{ textAlign: "center" }}>
                <Input
                  size="md"
                  placeholder="Add Menu"
                  onChange={(e) => setNewMenuName(e)}
                  style={{ width: 300 }}
                  required
                  value={newMenuName}
                />
              </Box>
              {newMenuName.length > 20 ? (
                <Typography sx={{ fontSize: "13px", color: "#fd5c63", mt: 1 }}>
                  Maximum length 20
                </Typography>
              ) : (
                ""
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 5,
                  mt: 4,
                }}
              >
                <Button
                  sx={{
                    boxShadow: "0 5px 5px #3c3c3c42",
                    backgroundColor: "white",
                    borderRadius: 50,
                    height: 32,
                    fontSize: 13,
                  }}
                  onClick={() => {
                    setToggle(true);
                    setMenuToggle(false);
                  }}
                  size="small"
                  color="info"
                  variant="outlined"
                  startIcon={
                    <ArrowBackIosNewOutlinedIcon
                      sx={{ height: 15, mb: "1px" }}
                    />
                  }
                >
                  <span sx={{ pt: 2 }}>Back</span>
                </Button>
                <Button
                  sx={{
                    boxShadow: "0 5px 5px #3c3c3c42",
                    backgroundColor: "white",
                    borderRadius: 50,
                    height: 32,
                    fontSize: 13,
                  }}
                  onClick={() => {
                    setFeatureToggle(true);
                    setMenuToggle(false);
                  }}
                  size="small"
                  color="info"
                  variant="outlined"
                  endIcon={
                    <ArrowForwardIosOutlinedIcon
                      sx={{ height: 15, mb: "1px" }}
                    />
                  }
                  disabled={!newMenuName || newMenuName.length > 20}
                >
                  Next
                </Button>
              </Box>
            </Box>
          )} */}
              {/* {featureToggle && (
            <Box
              className={`box ${featureToggle ? "visible" : "hidden"}`}
              sx={{
                transform: featureToggle
                  ? "translateX(0)"
                  : "translateX(-100%)",
                opacity: featureToggle ? 1 : 0,
                transition:
                  "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // Center align child elements horizontally
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  display: "flex",
                  fontSize: "17px",
                  whiteSpace: "nowrap",
                  gap: 2,
                  justifyContent: "center",
                  alignItems: "center",
                  marginY: 2,
                }}
                id="responsive-dialog-title"
              >
                <Typography
                  sx={{
                    border: "1px solid #146eb4",
                    display: "grid",
                    borderRadius: 50,
                    width: 25,
                    height: 25,
                    placeItems: "center",
                    fontWeight: 800,
                    color: "#146eb4",
                  }}
                >
                  2
                </Typography>
                <Typography sx={{ fontWeight: 800, fontSize: 17 }}>
                  What is your Sub Menu name?
                </Typography>
              </Typography>
              <Box sx={{ textAlign: "center" }}>
                <Input
                  size="md"
                  placeholder="Add Sub Menu"
                  onChange={(e) => setNewNewSubMenuName(e)}
                  style={{ width: 300 }}
                  required
                  value={newNewSubMenuName}
                />
              </Box>
              {newNewSubMenuName.length > 20 ? (
                <Typography sx={{ fontSize: "13px", color: "#fd5c63", mt: 1 }}>
                  Maximum length 20
                </Typography>
              ) : (
                ""
              )}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 5,
                  mt: 4,
                  ml: 1,
                }}
              >
                <Button
                  sx={{
                    boxShadow: "0 5px 5px #3c3c3c42",
                    backgroundColor: "white",
                    borderRadius: 50,
                    height: 32,
                    fontSize: 13,
                  }}
                  onClick={() => {
                    setFeatureToggle(false);
                    setMenuToggle(true);
                  }}
                  size="small"
                  color="info"
                  variant="outlined"
                  startIcon={
                    <ArrowBackIosNewOutlinedIcon
                      sx={{ height: 15, mb: "1px" }}
                    />
                  }
                >
                  Back
                </Button>
                <Button
                  sx={{
                    boxShadow: "0 5px 5px #3c3c3c42",
                    backgroundColor: "white",
                    borderRadius: 50,
                    height: 32,
                    fontSize: 13,
                  }}
                  onClick={() => {
                    setFeatureToggle(false);
                    setSubFeatureToggle(true);
                  }}
                  size="small"
                  color="info"
                  variant="outlined"
                  endIcon={
                    <ArrowForwardIosOutlinedIcon
                      sx={{ height: 15, mb: "1px" }}
                    />
                  }
                  disabled={!newNewSubMenuName || newNewSubMenuName.length > 20}
                >
                  Next
                </Button>
              </Box>
            </Box>
          )} */}
              {/* {subFeatureToggle && (
            <>
              <Box
                className={`box ${subFeatureToggle ? "visible" : "hidden"}`}
                sx={{
                  transform: subFeatureToggle
                    ? "translateX(0)"
                    : "translateX(-100%)",
                  opacity: subFeatureToggle ? 1 : 0,
                  transition:
                    "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center", // Center align child elements horizontally
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    display: "flex",
                    fontSize: "17px",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "center",
                    marginY: 2,
                    ml: -1,
                  }}
                  id="responsive-dialog-title"
                >
                  <Typography
                    sx={{
                      border: "1px solid #146eb4",
                      display: "grid",
                      borderRadius: 50,
                      width: 25,
                      height: 25,
                      placeItems: "center",
                      fontWeight: 800,
                      color: "#146eb4",
                    }}
                  >
                    3
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: 17 }}>
                    What is your Feature name?
                  </Typography>
                </Typography>
                <Box sx={{ marginY: 1 }}>
                  {allFeatureName.length > 0
                    ? allFeatureName?.map((feature, index) => {
                        return (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Input
                              readOnly
                              size="md"
                              placeholder="Add Feature"
                              value={feature}
                              style={{ width: 260, pb: 1 }}
                            />
                            <DeleteIcon
                              onClick={() => handleRemoveFeature(index)}
                              sx={{ color: "#fd5c63", fontSize: 30 }}
                            />
                          </Box>
                        );
                      })
                    : ""}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Input
                    size="md"
                    placeholder="Add Feature"
                    onChange={(e) => setFeatureName(e)}
                    style={{ width: 260 }}
                    value={featureName}
                  />
                  {featureName.length > 20 ? (
                    <ControlPointIcon
                      sx={{
                        fontSize: 30,
                        color: "#caccd1",
                        cursor: "not-allowed",
                      }}
                    />
                  ) : (
                    <ControlPointIcon
                      onClick={() => handleChangeFeature()}
                      sx={{ fontSize: 30, color: "#146eb4", cursor: "pointer" }}
                    />
                  )}
                </Box>
                {featureName.length > 20 ? (
                  <Typography
                    sx={{ fontSize: "13px", color: "#fd5c63", mt: 1 }}
                  >
                    Maximum length 20
                  </Typography>
                ) : (
                  ""
                )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 5,
                    mt: 4,
                  }}
                >
                  <Button
                    onClick={() => {
                      setFeatureToggle(true);
                      setSubFeatureToggle(false);
                    }}
                    size="small"
                    color="info"
                    variant="outlined"
                    sx={{
                      boxShadow: "0 5px 5px #3c3c3c42",
                      backgroundColor: "white",
                      borderRadius: 50,
                      height: 32,
                      fontSize: 13,
                      paddingX: 3,
                    }}
                    startIcon={
                      <ArrowBackIosNewOutlinedIcon
                        sx={{ height: 15, mb: "1px" }}
                      />
                    }
                  >
                    Back
                  </Button>
                  <Button
                    sx={{
                      boxShadow: "0 5px 5px #3c3c3c42",
                      backgroundColor: "white",
                      borderRadius: 50,
                      height: 32,
                      fontSize: 13,
                    }}
                    onClick={() => {
                      setNewFeatureSubmitToggle(true);
                      setSubFeatureToggle(false);
                    }}
                    size="small"
                    color="info"
                    variant="outlined"
                    endIcon={
                      <ArrowForwardIosOutlinedIcon
                        sx={{ height: 15, mb: "1px" }}
                      />
                    }
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            </>
          )} */}
              {/* {newFeatureSubmitToggle && (
            <Box
              className={`box ${newFeatureSubmitToggle ? "visible" : "hidden"}`}
              sx={{
                transform: newFeatureSubmitToggle
                  ? "translateX(0)"
                  : "translateX(-100%)",
                opacity: newFeatureSubmitToggle ? 1 : 0,
                transition:
                  "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // Center align child elements horizontally
                justifyContent: "center",
              }}
            >
              <Box sx={{ backgroundColor: "#C6FCFF", p: 4, borderRadius: 2 }}>
                <Typography
                  style={{ whiteSpace: "nowrap" }}
                  variant="body2"
                  sx={{
                    textAlign: "center",
                    fontWeight: 800,
                    marginTop: 5,
                    marginBottom: 1,
                    fontSize: 17,
                  }}
                >
                  Your New Menu
                </Typography>
                <Box sx={{ textAlign: "center" }}>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    value={newMenuName ? newMenuName : "N/A"}
                    sx={{
                      backgroundColor: "#87CEEB",
                      borderRadius: 1,
                      width: 300,
                      fontWeight: 800,
                    }}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                  />
                </Box>
                <Typography
                  style={{ whiteSpace: "nowrap" }}
                  variant="body2"
                  sx={{
                    textAlign: "center",
                    fontWeight: 800,
                    marginTop: 5,
                    marginBottom: 1,
                    fontSize: 17,
                  }}
                >
                  Your New Sub Menu
                </Typography>
                <Box sx={{ textAlign: "center" }}>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    value={newNewSubMenuName ? newNewSubMenuName : "N/A"}
                    sx={{
                      backgroundColor: "#87CEEB",
                      borderRadius: 1,
                      width: 300,
                      fontWeight: 800,
                    }}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                  />
                  <Typography
                    style={{ whiteSpace: "nowrap" }}
                    variant="body2"
                    sx={{
                      textAlign: "center",
                      fontWeight: 800,
                      marginTop: 5,
                      marginBottom: 1,
                      fontSize: 17,
                    }}
                  >
                    New Feature list
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center", // Center align child elements horizontally
                      justifyContent: "center",
                    }}
                  >
                    {allFeatureName.length > 0 ? (
                      allFeatureName?.map((feature) => {
                        return (
                          <TextField
                            size="small"
                            id="outlined-basic"
                            value={feature}
                            sx={{
                              backgroundColor: "white",
                              borderRadius: 1,
                              boxShadow: "rgba(10, 157, 37, 0.16) 0px 2px 2px",
                              width: 300,
                            }}
                            InputProps={{
                              readOnly: true,
                            }}
                            variant="outlined"
                          />
                        );
                      })
                    ) : (
                      <TextField
                        size="small"
                        id="outlined-basic"
                        value="N/A"
                        sx={{
                          backgroundColor: "white",
                          borderRadius: 1,
                          boxShadow: "rgba(10, 157, 37, 0.16) 0px 2px 2px",
                          width: 300,
                        }}
                        InputProps={{
                          readOnly: true,
                        }}
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 5,
                    mt: 3,
                    pb: 1,
                  }}
                >
                  <Button
                    onClick={() => {
                      setSubFeatureToggle(true);
                      setNewFeatureSubmitToggle(false);
                    }}
                    size="small"
                    color="info"
                    variant="outlined"
                    sx={{
                      boxShadow: "0 5px 5px #3c3c3c42",
                      backgroundColor: "white",
                      borderRadius: 50,
                      height: 32,
                      fontSize: 13,
                      paddingX: 3,
                    }}
                    startIcon={
                      <ArrowBackIosNewOutlinedIcon
                        sx={{ height: 15, mb: "1px" }}
                      />
                    }
                  >
                    Back
                  </Button>
                  <Button
                  onClick={()=>handleSubmitFeature()}
                    sx={{
                      boxShadow: "0 5px 5px #3c3c3c42",
                      borderRadius: 50,
                      height: 32,
                    }}
                    autoFocus
                    variant="contained"
                    size="small"
                    color="info"
                    endIcon={<ArrowUpwardIcon />}
                  >
                    Submit
                  </Button>
                </Box>
              </Box>
            </Box>
          )} */}

              <Fab size="small" id="tutorials-button" variant="extended">
                <Button
                  onClick={() => setOpenTutorialDialog(true)}
                  size="small"
                  className="animated-button"
                >
                  {/* extra spans are here for animated design.*/}
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  Tutorial
                </Button>
              </Fab>
            </Box>
          </DialogContent>
        )}
      </Dialog>
      <AddFeatureTutorial
        openTutorialDialog={openTutorialDialog}
        setOpenTutorialDialog={setOpenTutorialDialog}
      ></AddFeatureTutorial>
    </div>
  );
};

export default AddFeatureDialog;
