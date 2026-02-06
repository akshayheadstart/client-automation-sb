import { Box } from "@mui/material";
import Lottie from "lottie-web";
import React, { useEffect, useRef } from "react";
import error500AnimationData from "../../../images/error500Animation.json";

const Error500Animation = (props) => {
  const { height, width } = props;
  const animation = useRef(null);

  useEffect(() => {
    const lottie = Lottie.loadAnimation({
      container: animation.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: error500AnimationData,
      nodeScroll: true
    });
    return () => lottie.destroy()
  }, []);

  return (
    <Box
      data-testid="internal-server-error-animation"
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

export default Error500Animation;
