import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import "../../../styles/userProfileinfoCard.css";
import { useSelector } from "react-redux";
import useToasterHook from "../../../hooks/useToasterHook";
import CircularProgress from "@mui/material/CircularProgress";
import "../../../styles/sharedStyles.css";
import Cookies from "js-cookie";
import { customFetch } from "../../../pages/StudentTotalQueries/helperFunction";
const UserProfileAPICallDialog = ({
  openConfirmAPImessage,
  handleOpenConfirmAPImessageClose,
  userProfileHeader,
  selectText,
  setSelectText,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const tokenState = useSelector((state) => state.authentication.token);
  const pushNotification = useToasterHook();
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const handleSendVerificationEmail = () => {
    setLoading(true);
    if (import.meta.env.VITE_ACCOUNT_TYPE === "demo") {
      pushNotification("success", "SuccessFully Sent Verification mail !");
      setLoading(false);
      handleOpenConfirmAPImessageClose();
      setSelectText("");
    } else {
      customFetch(
        `${import.meta.env.VITE_API_BASE_URL}/student/email/verification/?${
          tokenState?.user_id ? `user_id=${tokenState?.user_id}` : ""
        }${tokenState?.user_id ? `&` : ""}college_id=${
          collegeId ? collegeId : ""
        }`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify([userProfileHeader?.basic_info?.email]),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data?.message) {
            pushNotification("success", data?.message);
            handleOpenConfirmAPImessageClose();
            setSelectText("");
            setLoading(false);
          } else if (data?.detail) {
            pushNotification("error", data?.detail);
            setLoading(false);
          }
        });
    }
  };
  const handleSendVerificationMobile = () => {
    setLoading(true);
    customFetch(
      `${import.meta.env.VITE_API_BASE_URL}/student_user_crud/login_with_otp/?${
        tokenState?.user_id ? `user_id=${tokenState?.user_id}` : ""
      }&email_or_mobile=${userProfileHeader?.basic_info?.mobile}&college_id=${
        collegeId ? collegeId : ""
      }`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.message) {
          pushNotification("success", data?.message);
          handleOpenConfirmAPImessageClose();
          setSelectText("");
          setLoading(false);
        } else if (data?.detail) {
          pushNotification("error", data?.detail);
          setLoading(false);
        }
      });
  };
  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={openConfirmAPImessage}
        onClose={handleOpenConfirmAPImessageClose}
        aria-labelledby="responsive-dialog-title"
      >
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress color="info" />
          </Box>
        )}
        <DialogContent>
          {selectText === "mail" && (
            <DialogContentText className="user-profile-dialog-text">
              <Typography>Do you want to send Verification link</Typography>
              <Typography
                sx={{ display: "flex", gap: "2px", justifyContent: "center" }}
              >
                {" "}
                <Typography sx={{ fontWeight: 800 }}>
                  {userProfileHeader?.basic_info?.name}
                </Typography>{" "}
                over mail?
              </Typography>
            </DialogContentText>
          )}
          {selectText === "mobile" && (
            <DialogContentText className="user-profile-dialog-text">
              <Typography>Do you want to send OTP to</Typography>
              <Typography
                sx={{ display: "flex", gap: "2px", justifyContent: "center" }}
              >
                <Typography sx={{ fontWeight: 800 }}>
                  {userProfileHeader?.basic_info?.name}?
                </Typography>
              </Typography>
            </DialogContentText>
          )}
        </DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            mt: 2,
            mb: 4,
          }}
        >
          <Button
            sx={{
              borderRadius: 50,
            }}
            type="submit"
            variant="contained"
            size="small"
            color="info"
            className="save-button-design"
            onClick={() => {
              if (selectText === "mail") {
                handleSendVerificationEmail();
              } else if (selectText === "mobile") {
                handleSendVerificationMobile();
              }
            }}
          >
            Continue
          </Button>
          <Button
            sx={{
              borderRadius: 50,
            }}
            variant="outlined"
            size="small"
            type="button"
            color="info"
            className="cancel-button-design"
            onClick={() => {
              handleOpenConfirmAPImessageClose();
              setSelectText("");
            }}
          >
            Cancel
          </Button>
        </Box>
      </Dialog>
    </div>
  );
};

export default UserProfileAPICallDialog;
