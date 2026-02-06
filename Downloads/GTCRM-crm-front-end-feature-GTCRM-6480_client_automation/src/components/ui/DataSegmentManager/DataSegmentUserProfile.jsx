import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useContext, useEffect, useState } from "react";
import { userDataRole } from "../../../constants/LeadStageList";
import accessAvatar from "../../../images/accessAvatar.png";
import avatar from "../../../images/avatar.png";
import "../../../styles/dataSegmentUserProfile.css";
import "../../../styles/sharedStyles.css";
import { useGetAllUserDataQuery } from "../../../Redux/Slices/filterDataSlice";
import { ApiCallHeaderAndBody } from "../../../hooks/ApiCallHeaderAndBody";
import Cookies from "js-cookie";
import useToasterHook from "../../../hooks/useToasterHook";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import { useSelector } from "react-redux";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import {
  customFetch,
  extractToken,
} from "../../../pages/StudentTotalQueries/helperFunction";
const DataSegmentUserProfile = ({
  open,
  handleDataSegmentShareLinkClose,
  selectedUserInfo,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const [addUserAccess, setAddUserAccess] = useState([]);
  const [addUserAccessId, setAddUserAccessId] = useState([]);
  const [addUserRoleChange, setAddUserRoleChange] = useState("viewer");

  const [message, setMessage] = useState("");
  useEffect(() => {
    if (addUserAccess) {
      const allIds = addUserAccess?.map((user) => user.user_id);
      setAddUserAccessId(allIds);
    } else {
      setAddUserAccessId([]);
    }
  }, [addUserAccess]);
  const payload = {
    user_id: addUserAccessId,
    message: message,
  };
  const [skipUserListAPICall, setSkipUserListAPICall] = useState(true);
  const [allUserInfoData, setAllUserInfoData] = useState([]);

  const allUserList = useGetAllUserDataQuery({}, { skip: skipUserListAPICall });

  useEffect(() => {
    if (!skipUserListAPICall) {
      const allUserData = allUserList?.data?.data[0];
      if (allUserData) {
        setAllUserInfoData(allUserData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allUserList, skipUserListAPICall]);
  //AllAccessUser api call
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const [allAccessUserList, setAllAccessUserList] = useState([]);
  const pushNotification = useToasterHook();
  //getting data form context
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [hideAllAccessUser, setHideAllAccessUser] = useState(false);
  const [callAllAccessUserAPI, setCallAllAccessUserAPI] = useState(false);
  const [loadingAllAccessUserAPI, setLoadingAllAccessUserAPI] = useState(false);
  const [
    allAccessUserInternalServerError,
    setAllAccessUserInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInAllAccessUser,
    setSomethingWentWrongInAllAccessUser,
  ] = useState(false);
  const getAllAccessUserApiUrl = `${
    import.meta.env.VITE_API_BASE_URL
  }/data_segment/data_segment_shared_user_details?data_segment_id=${
    selectedUserInfo?.data_segment_id
  }&college_id=${collegeId}`;

  useEffect(() => {
    if (selectedUserInfo?.data_segment_id) {
      setLoadingAllAccessUserAPI(true);
      customFetch(getAllAccessUserApiUrl, ApiCallHeaderAndBody(token, "GET"))
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            try {
              if (Array.isArray(data)) {
                setAllAccessUserList(data);
              } else {
                throw new Error("All AccessUser List API response has changed");
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setSomethingWentWrongInAllAccessUser,
                setHideAllAccessUser,
                10000
              );
            }
          } else if (data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (data?.detail) {
            pushNotification("error", data?.detail);
            setAllAccessUserList([]);
          }
        })
        .catch((error) => {
          handleInternalServerError(
            setAllAccessUserInternalServerError,
            setHideAllAccessUser,
            10000
          );
        })
        .finally(() => {
          setCallAllAccessUserAPI(false);
          setLoadingAllAccessUserAPI(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callAllAccessUserAPI, selectedUserInfo?.data_segment_id]);
  //add user API
  const [addUserInternalServerError, setAddUserInternalServerError] =
    useState(false);
  const [somethingWentWrongInAddUser, setSomethingWentWrongInAddUser] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const handleAddUserAccess = () => {
    setLoading(true);
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/data_segment/create_share_link_segment?data_segment_id=${
        selectedUserInfo?.data_segment_id
      }&segment_permission=${addUserRoleChange}&college_id=${collegeId}`,
      ApiCallHeaderAndBody(token, "POST", JSON.stringify(payload))
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result.detail) {
          pushNotification("error", result.detail);
        } else {
          try {
            if (result?.data) {
              pushNotification("success", result?.data);
              setCallAllAccessUserAPI(true);
              handleDataSegmentShareLinkClose();
            } else {
              throw new Error(
                "create_share_link_segment API response has changed"
              );
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(setSomethingWentWrongInAddUser, "", 5000);
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(setAddUserInternalServerError, "", 5000);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [userToken, setUserToken] = useState("");
  useEffect(() => {
    if (selectedUserInfo?.share_link) {
      setUserToken(extractToken(selectedUserInfo?.share_link));
    }
  }, [selectedUserInfo?.share_link]);

  const profileUrl = `${window.location.origin}/data-segment-details/${userToken}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      pushNotification("success", "Data segment link copied!");
    } catch (error) {
      pushNotification("error", "Failed to copy");
    }
  };
  //Update particular user Access
  const handleAddParticularUserAccess = (user, type) => {
    setLoading(true);
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/data_segment/update_shared_user_permission?data_segment_id=${
        selectedUserInfo?.data_segment_id
      }&permission_type=${type}&email_id=${user?.email}&user_id=${
        user?.user_id
      }&college_id=${collegeId}`,
      ApiCallHeaderAndBody(token, "PUT")
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result.detail) {
          pushNotification("error", result.detail);
        } else {
          try {
            if (result?.data) {
              pushNotification("success", result?.data);
              setCallAllAccessUserAPI(true);
            } else {
              throw new Error(
                "create_share_link_segment API response has changed"
              );
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(setSomethingWentWrongInAddUser, "", 5000);
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(setAddUserInternalServerError, "", 5000);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  //Remove User Access
  const handleRemoveParticularUserAccess = (user) => {
    setLoading(true);
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/data_segment/remove_data_segment_permission_access?data_segment_id=${
        selectedUserInfo?.data_segment_id
      }&user_id=${user?.user_id}&college_id=${collegeId}`,
      ApiCallHeaderAndBody(token, "GET")
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result.detail) {
          pushNotification("error", result.detail);
        } else {
          try {
            if (result?.message) {
              pushNotification("success", result?.message);
              setCallAllAccessUserAPI(true);
            } else {
              throw new Error(
                "remove_share_link_segment API response has changed"
              );
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(setSomethingWentWrongInAddUser, "", 5000);
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(setAddUserInternalServerError, "", 5000);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleDataSegmentShareLinkClose}
        aria-labelledby="responsive-dialog-title"
        className="change-data-segment-box-container"
      >
        <DialogContent className="vertical-scrollbar" sx={{ p: 0 }}>
          <Box className="data-segment-dialog-box">
            <Box className="data-segment-dialog-box-container">
              <Typography className="data-segment-dialog-headline-text">
                Share {selectedUserInfo?.data_segment_name}
              </Typography>
              <CloseIcon
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  handleDataSegmentShareLinkClose();
                }}
              />
            </Box>
            {loading && (
              <Box sx={{ my: "10px", display: "grid", placeItems: "center" }}>
                <CircularProgress color="info" />
              </Box>
            )}
            <Box className="data-segment-add-user-box">
              <Autocomplete
                value={addUserAccess}
                className="add-user-profile"
                multiple
                required
                size="small"
                getOptionLabel={(option) => option?.user_email}
                options={allUserInfoData}
                onChange={(event, newValue) => {
                  setAddUserAccess(newValue);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      avatar={<Avatar alt="Natacha" src={avatar} />}
                      label={option.user_name}
                      {...getTagProps({ index })}
                      style={{
                        backgroundColor: "#0FABBD",
                        margin: "2px",
                        color: "white",
                      }}
                      className="add-user-profile-chip"
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    sx={{
                      width: addUserAccess.length > 0 ? "300px" : "500px",
                      borderRadius: "8px",
                      // border: "1px solid #B3D2E2",
                    }}
                    color="info"
                    label="Add people"
                    name="Add people"
                    {...params}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props} className="vertical-scrollbar">
                    <Box
                      className="data-segment-user-info-box"
                      sx={{ py: "5px", cursor: "pointer" }}
                    >
                      <img
                        src={accessAvatar}
                        alt="profile icon"
                        width={"40px"}
                        height={"40px"}
                      />
                      <Box>
                        <Typography className="data-segment-user-name-role-text">
                          {option?.user_name} | {option?.user_role}
                        </Typography>
                        <Typography className="data-segment-user-name-role-email">
                          {option?.user_email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
                loading={
                  allUserList.isFetching ? allUserList.isFetching : false
                }
                onOpen={() => {
                  setSkipUserListAPICall(false);
                }}
              />
              {addUserAccess.length > 0 && (
                <Autocomplete
                  defaultValue={"viewer"}
                  className="add-user-profile-role"
                  required
                  size="small"
                  getOptionLabel={(option) => option}
                  options={userDataRole}
                  onChange={(event, newValue) => {
                    setAddUserRoleChange(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      sx={{
                        width: "150px",
                        borderRadius: "8px",
                      }}
                      color="info"
                      label="Permission"
                      name="Permission"
                      {...params}
                    />
                  )}
                />
              )}
            </Box>
            {addUserAccess.length === 0 && (
              <>
                {allAccessUserInternalServerError ||
                somethingWentWrongInAllAccessUser ||
                somethingWentWrongInAddUser ||
                addUserInternalServerError ? (
                  <>
                    {(allAccessUserInternalServerError ||
                      addUserInternalServerError) && (
                      <Error500Animation
                        height={400}
                        width={400}
                      ></Error500Animation>
                    )}
                    {(somethingWentWrongInAllAccessUser ||
                      somethingWentWrongInAddUser) && (
                      <ErrorFallback
                        error={apiResponseChangeMessage}
                        resetErrorBoundary={() => window.location.reload()}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {loadingAllAccessUserAPI ? (
                      <Box className="loading-lottie-file-container">
                        <LeefLottieAnimationLoader
                          height={150}
                          width={150}
                        ></LeefLottieAnimationLoader>
                      </Box>
                    ) : (
                      <>
                        <Box className="data-segment-access-user-list-box">
                          <Typography className="data-segment-access-text">
                            People with access
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            height:
                              allAccessUserList.length > 3 ? "250px" : "250px",
                            overflowY:
                              allAccessUserList.length > 3 ? "scroll" : "",
                            visibility: hideAllAccessUser
                              ? "hidden"
                              : "visible",
                            paddingRight:
                              allAccessUserList.length > 3 ? "10px" : "0px",
                          }}
                          className="vertical-scrollbar"
                        >
                          {allAccessUserList.length === 0 ? (
                            <Box sx={{ display: "grid", alignItems: "center" }}>
                              <BaseNotFoundLottieLoader
                                height={250}
                                width={250}
                              ></BaseNotFoundLottieLoader>
                            </Box>
                          ) : (
                            <>
                              {allAccessUserList?.map((user) => {
                                return (
                                  <Box className="data-segment-access-user-list-box">
                                    <Box className="data-segment-access-info-details-box">
                                      <Box className="data-segment-user-info-box">
                                        <img
                                          src={accessAvatar}
                                          alt="profile icon"
                                          width={"57px"}
                                          height={"57px"}
                                        />
                                        <Box>
                                          <Typography
                                            className="data-segment-user-name-role-text"
                                            sx={{
                                              maxWidth: "280px",
                                              overflowWrap: "break-word",
                                            }}
                                          >
                                            {user?.name} | {user?.role}
                                          </Typography>
                                          <Typography className="data-segment-user-name-role-email">
                                            {user?.email}
                                          </Typography>
                                        </Box>
                                      </Box>
                                      <Autocomplete
                                        defaultValue={
                                          user?.permission
                                            ? user?.permission
                                            : ""
                                        }
                                        //   value={user?.access}
                                        className="add-user-profile-role"
                                        required
                                        size="small"
                                        getOptionLabel={(option) => option}
                                        options={userDataRole}
                                        onChange={(event, newValue) => {
                                          handleAddParticularUserAccess(
                                            user,
                                            newValue
                                          );
                                        }}
                                        renderInput={(params) => (
                                          <TextField
                                            // required={collegeID ? false : true}
                                            sx={{
                                              width: "150px",
                                              borderRadius: "8px",
                                              border: "1px solid #B3D2E2",
                                            }}
                                            color="info"
                                            name="Add Role"
                                            {...params}
                                          />
                                        )}
                                      />
                                      <CloseIcon
                                        sx={{
                                          cursor: "pointer",
                                          width: "20px",
                                        }}
                                        onClick={() => {
                                          handleRemoveParticularUserAccess(
                                            user
                                          );
                                        }}
                                      />
                                    </Box>
                                  </Box>
                                );
                              })}
                            </>
                          )}
                        </Box>
                      </>
                    )}
                  </>
                )}
              </>
            )}
            {addUserAccess.length > 0 && (
              <Box>
                <TextField
                  id="outlined-multiline-static"
                  label="Message"
                  fullWidth
                  multiline
                  rows={4}
                  sx={{ borderRadius: "8px" }}
                  color="info"
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                />
              </Box>
            )}
            <Box className="data-segment-button-box-container">
              <Box className="data-segment-button-box">
                {addUserAccess.length === 0 && (
                  <Button
                    className="data-segment-dialog-button"
                    variant="outlined"
                    color="info"
                    sx={{ borderRadius: 50 }}
                    onClick={() => copyToClipboard()}
                  >
                    Copy Link
                  </Button>
                )}
                {addUserAccess.length > 0 && (
                  <>
                    <Button
                      className="data-segment-dialog-button"
                      variant="outlined"
                      color="info"
                      sx={{ borderRadius: 50 }}
                      onClick={() => {
                        handleDataSegmentShareLinkClose();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="data-segment-dialog-button"
                      variant="contained"
                      color="info"
                      sx={{ borderRadius: 50 }}
                      onClick={() => handleAddUserAccess()}
                      disabled={
                        allAccessUserList.length === 0 &&
                        addUserRoleChange.length === 0
                      }
                    >
                      Done
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default DataSegmentUserProfile;
