import React, { useState } from "react";
import {
  Container,
  Grid,
  Card,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import "../../styles/Login.css";
import { Link } from "react-router-dom";

function PasswordReset(props) {
  const [passwordShowHide, setPasswordShowHide] = useState(true);
  const [passwordShowHide2, setPasswordShowHide2] = useState(true);
  const showHidePassword = () => {
    setPasswordShowHide(!passwordShowHide);
  };
  const passwordConfirmation = () => {
    setPasswordShowHide2(!passwordShowHide2);
  };

  return (
    <Box
      component="main"
      className="password-reset"
      sx={{ flexGrow: 1, py: 2 }}
    >
      <Container sx={{ pt: 5 }}>
        <Grid container sx={{ justifyContent: "center" }}>
          <Grid item md={6} sm={8} xs={12}>
            <Card elevation={16} sx={{ p: 4 }}>
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h5">Password Reset</Typography>
                <Typography
                  color="textSecondary"
                  sx={{ mt: 2 }}
                  variant="body2"
                >
                  Reset your account password using your code
                </Typography>
                <Box sx={{ flexGrow: 1, width: "100%" }}>
                  <TextField
                    sx={{ mt: 4 }}
                    fullWidth
                    // label="Email Address"
                    name="email"
                    type="email"
                    value="demo@shiftboolean.com"
                    disabled
                  />
                  <Box sx={{ mt: 3 }}>
                    <Typography className="" variant="body1">
                      Verification code
                    </Typography>
                    <Box
                      className="verification_code"
                      sx={{
                        mt: 3,
                        // display: "flex",
                        // alignItems: "center",
                        // justifyContent: "space-between",
                      }}
                    >
                      <TextField
                        name="opt"
                        type="text"
                        className="verify-field"
                        color="info"
                      />
                      <TextField
                        name="opt"
                        type="text"
                        className="verify-field"
                        color="info"
                      />
                      <TextField
                        name="opt"
                        type="text"
                        className="verify-field"
                        color="info"
                      />
                      <TextField
                        name="opt"
                        type="text"
                        className="verify-field"
                        color="info"
                      />
                      <TextField
                        name="opt"
                        type="text"
                        className="verify-field"
                        color="info"
                      />
                      <TextField
                        name="opt"
                        type="text"
                        className="verify-field"
                        color="info"
                      />
                    </Box>
                  </Box>

                  <Box className="password-field">
                    <TextField
                      sx={{ mt: 3 }}
                      color="info"
                      fullWidth
                      label="Password"
                      name="password"
                      type={passwordShowHide ? "password" : "text"}
                    />
                    <Box
                      component="span"
                      className="password-icon"
                      onClick={showHidePassword}
                    >
                      {passwordShowHide ? (
                        <VisibilityOffIcon size="small" />
                      ) : (
                        <VisibilityIcon size="small" />
                      )}
                    </Box>
                  </Box>
                  {/* ------Password Confirmation ------- */}
                  <Box className="password-field">
                    <TextField
                    color="info"
                      sx={{ mt: 4 }}
                      fullWidth
                      label="Password Confirmation"
                      name="password-confirmation"
                      type={passwordShowHide2 ? "password" : "text"}
                    />
                    <Box
                      component="span"
                      className="password-icon"
                      onClick={passwordConfirmation}
                    >
                      {passwordShowHide2 ? (
                        <VisibilityOffIcon size="small" />
                      ) : (
                        <VisibilityIcon size="small" />
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ mt: 4 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ fontSize: "20px" }}
                    >
                      Reset Password
                    </Button>
                  </Box>
                  <Box sx={{ mt: 4 }}>
                    <Link to="">
                      <Typography
                        component="a"
                        color="textSecondary"
                        variant="body2"
                      >
                        Did you not receive the code?
                      </Typography>
                    </Link>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default PasswordReset;
