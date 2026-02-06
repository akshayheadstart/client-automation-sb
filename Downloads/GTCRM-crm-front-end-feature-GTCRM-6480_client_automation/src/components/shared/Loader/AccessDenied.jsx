
import React, { useEffect, useRef } from "react";
import Lottie from "lottie-web";
import accessDeniedLoadingAnimation from "../../../images/accessDenied.json";
import { Box } from "@mui/material";
const AccessDenied = (props) => {
    const { height, width, noContainer } = props;
  const anime = useRef(null);

  useEffect(() => {
    const lottie = Lottie.loadAnimation({
      container: anime.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: accessDeniedLoadingAnimation,
    });
    return () => lottie.destroy();
  }, []);
    return (
        <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          data-testid="not-found-animation"
          className={`full-width-height ${noContainer ? "" : "container"}`}
          style={{ height: height, width: width }}
          ref={anime}
        ></Box>
      </Box>
    );
};

export default AccessDenied;