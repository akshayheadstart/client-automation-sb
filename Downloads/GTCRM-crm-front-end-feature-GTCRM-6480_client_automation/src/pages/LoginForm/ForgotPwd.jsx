import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { TopContext } from "../../store/contexts/TopContext";
import PasswordVisibilityIcon from "../../components/ui/PasswordVisibility/PasswordVisibilityIcon";
import "../../styles/Login.css";
import useToasterHook from "../../hooks/useToasterHook";


function ForgotPwd() {
  const pushNotification = useToasterHook()
  const { token } = useParams();
  const { setShowLogin } = useContext(TopContext);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [values, setValues] = useState({
    showNewPassword: false,
    showConfirmPassword: false,
  });
  const navigate = useNavigate();
  const handleClickShowNewPassword = () => {
    setValues({
      ...values,
      showNewPassword: !values.showNewPassword,
    });
  };
  const handleClickShowConfirmPassword = () => {
    setValues({
      ...values,
      showConfirmPassword: !values.showConfirmPassword,
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleLoginAndRegister = (value) => {
    setShowLogin(value);
    navigate("/login");
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      if (newPassword.length > 7 && newPassword.length <= 20) {
        fetch(
          `${import.meta.env.VITE_API_BASE_URL}/user/dkper/user/${token}?new_password=${newPassword}`
        )
          .then((res) => res.json())
          .then((result) => {
            if (result.code === 200) {
              navigate("/verifyPage", {
                state: {
                  name: "passwordSuccessfullyVerify",
                  message: result?.message,
                  title: "Password Reset Successfully",
                },
              });
            } else if (result?.detail) {
              navigate("/verifyPage", {
                state: {
                  name: "passwordVerifyError",
                  message: result?.detail,
                  title: "Password Reset Failed",
                },
              });
            }
          }).catch((error) => {
            navigate("/page500")
          });
      } else {
        pushNotification("warning", "Password must be greater than 8 and less than 20")
      }
    } else {
      pushNotification("New and confirm password don't matched!")
    }
  };

  return (
    <Box className="authentication-container">
      <Box className="authentication-wrapper">
        <Box className="common-authentication-form">
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h5">Reset Password</Typography>
          </Box>
          <form onSubmit={handlePasswordReset}>
            <FormControl
              size="small"
              sx={{ width: "100%", marginTop: "1rem" }}
              variant="outlined"
            >
              <InputLabel htmlFor="new-password">New Password</InputLabel>
              <OutlinedInput
                onChange={(e) => setNewPassword(e.target.value)}
                id="new-password"
                type={values.showNewPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowNewPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      <PasswordVisibilityIcon value={values.showNewPassword} />
                    </IconButton>
                  </InputAdornment>
                }
                label="New Password"
              />
            </FormControl>

            <FormControl
              size="small"
              sx={{ width: "100%", marginTop: "1rem" }}
              variant="outlined"
            >
              <InputLabel htmlFor="confirm-password">
                Confirm Password
              </InputLabel>
              <OutlinedInput
                onChange={(e) => setConfirmPassword(e.target.value)}
                id="confirm-password"
                type={values.showConfirmPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      <PasswordVisibilityIcon
                        value={values.showConfirmPassword}
                      />
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm Password"
              />
            </FormControl>
            <Button
              sx={{ marginTop: "1rem" }}
              fullWidth
              size="small"
              variant="contained"
              type="submit"
            >
              SUBMIT
            </Button>
          </form>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Button onClick={() => handleLoginAndRegister("login")}>
              {" "}
              LOGIN?
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ForgotPwd;
