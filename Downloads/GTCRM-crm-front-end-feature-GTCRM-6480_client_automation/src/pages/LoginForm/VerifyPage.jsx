import { Box, Button, Card, Container, Typography } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
const VerifyPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: "background.default",
        display: "flex ",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={16} sx={{ p: 4 }}>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {state?.name === "resetVerify" && (
              <MarkEmailReadIcon
                sx={{
                  height: 40,
                  width: 40,
                  color: "rgb(80, 72, 229)",
                }}
              ></MarkEmailReadIcon>
            )}
            {state?.name === "passwordSuccessfullyVerify" && (
              <CheckCircleIcon
                sx={{
                  height: 40,
                  width: 40,
                  color: "rgb(80, 72, 229)",
                }}
              >
                {" "}
              </CheckCircleIcon>
            )}
            {state?.name === "passwordVerifyError" && (
              <ErrorIcon
                sx={{
                  height: 40,
                  width: 40,
                  color: "red",
                }}
              ></ErrorIcon>
            )}
            <Typography variant="h4">{state?.title}</Typography>
            <Typography
              color="textSecondary"
              sx={{
                mt: 4,
                mb: 5,
                px: 5,
                py: 2,
                boxShadow:
                  "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;",
              }}
              textAlign="center"
              variant="body1"
            >
              {state?.name === "resetVerify" ? (
                <Box>
                  {" "}
                  A reset password link has been sent on your account
                  <span style={{ fontWeight: "bold" }}>
                    {" "}
                    {state?.resetEmail}{" "}
                  </span>{" "}
                  . Please click on the reset link and continue your application
                  process.
                </Box>
              ) : (
                <Box>{state?.message}</Box>
              )}
            </Typography>
            <Button
              endIcon={<ArrowForwardIcon fontSize="small" />}
              size="small"
              variant="contained"
              onClick={() => navigate("/login")}
            >
              CONTINUE
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};
export default VerifyPage;
