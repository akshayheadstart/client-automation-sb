import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Image401 from "../../images/error401_light.svg";
import "../../styles/ErrorPages.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";
const Page401 = () => {
  const navigate = useNavigate();
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  useEffect(() => {
    setTimeout(() => {
      if (token) {
        navigate("/");
        window.location.reload();
      } else {
        navigate("/login");
        window.location.reload();
      }
    }, 3000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box className="error-pages-layout">
      <Typography className="error-pages-title" variant="h3">
        401: Authorization required
      </Typography>
      <Typography className="error-pages-subtitle" variant="body1">
        You either tried some shady route or you came here by mistake. Whichever
        it is, try using the navigation.
      </Typography>
      <Box>
        <img className="error-pages-image" src={Image401} alt="error-404" />
      </Box>
      <Link className="error-pages-back-button-link" to="">
        <Button
          onClick={() => {
            navigate("/login");
            window.location.reload();
          }}
          className="error-pages-back-button"
          variant="outlined"
        >
          Back to Login
        </Button>
      </Link>
    </Box>
  );
};

export default Page401;
