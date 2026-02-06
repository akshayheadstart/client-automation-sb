import React from "react";
import { Box, Typography, Button } from "@mui/material";
import "../../styles/ErrorPages.css";
import { Link, useNavigate } from "react-router-dom";
import Image404 from "../../images/error404_light.svg";
import { useEffect } from "react";
import Cookies from "js-cookie";

const Page404 = () => {
  if(window.location.pathname.includes("/data-segment-details/")){
    localStorage.setItem(
     `requestRoute`,
     JSON.stringify(window.location.pathname)
    );
   }

  const navigate = useNavigate();

  setTimeout(() => {
    navigate("/");
  }, 3000);
  useEffect(() => {
    if (
      window.location.pathname.split("/").length > 2 &&
      window.location.pathname.includes("/userProfile")
    ) {
      Cookies.set("locationFrom", window.location.pathname);
    }
  }, []);

  return (
    <Box className="error-pages-layout">
      <Typography className="error-pages-title" variant="h3">
        404: The page you are looking for isn’t here
      </Typography>
      <Typography className="error-pages-subtitle" variant="body1">
        You either tried some shady route or you came here by mistake. Whichever
        it is, try using the navigation.
      </Typography>
      <Box>
        <img className="error-pages-image" src={Image404} alt="error-404" />
      </Box>
      <Link className="error-pages-back-button-link" to="/">
        <Button className="error-pages-back-button" variant="outlined">
          Back to Dashboard
        </Button>
      </Link>
    </Box>
  );
};

export default Page404;
