import React from "react";
import { Box, Typography, Button } from "@mui/material";
import "../../styles/ErrorPages.css";
import { Link, useNavigate } from "react-router-dom";
import Image500 from "../../images/error500_light.svg";

const Page500 = () => {

  const navigate = useNavigate();

  setTimeout(() => {
    navigate('/')
  }, 3000);

  return (
    <Box className="error-pages-layout">
      <Typography className="error-pages-title" variant="h3">
        500: Internal Server Error
      </Typography>
      <Typography className="error-pages-subtitle" variant="body1">
        You either tried some shady route or you came here by mistake. Whichever
        it is, try using the navigation.
      </Typography>
      <Box>
        <img className="error-pages-image" src={Image500} alt="error-500" />
      </Box>
      <Link className="error-pages-back-button-link" to="/">
        <Button className="error-pages-back-button" variant="outlined">
          Back to Dashboard
        </Button>
      </Link>
    </Box>
  );
};

export default Page500;
