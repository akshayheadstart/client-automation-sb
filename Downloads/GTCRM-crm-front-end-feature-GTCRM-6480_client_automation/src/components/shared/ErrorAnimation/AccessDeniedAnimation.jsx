import { Box } from "@mui/material";
import Lottie from "lottie-web";
import React, { useEffect, useRef } from "react";
import accessDeniedAnimationData from "../../../images/accessDeniedAnimation.json";

const AccessDeniedAnimation = (props) => {
  const { height, width } = props;
  const animation = useRef(null);

  useEffect(() => {
    const lottie = Lottie.loadAnimation({
      container: animation.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: accessDeniedAnimationData,
    });
    return () => lottie.destroy()
  }, []);

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Box
        className="full-width-height container"
        style={{ height: height, width: width }}
        ref={animation}
      ></Box>
    </Box>
  );
};

export default AccessDeniedAnimation;
