import { Box } from "@mui/material";
import Lottie from "lottie-web";
import React, { useEffect, useRef } from "react";
import error404AnimationData from "../../../images/error404Animation.json";

const Error404Animation = (props) => {
  const { height, width } = props;

  const animation = useRef(null);

  useEffect(() => {
    const lottie = Lottie.loadAnimation({
      container: animation.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: error404AnimationData,
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

export default Error404Animation;
