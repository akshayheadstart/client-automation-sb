import { Box } from "@mui/material";
import Lottie from "lottie-web";
import React, { useEffect, useRef } from "react";
import notFoundLoadingAnimation from "../../../images/lotiieforNotFoundBaseRoute.json";

const BaseNotFoundLottieLoader = (props) => {
  const { height, width, noContainer } = props;
  const anime = useRef(null);

  useEffect(() => {
    const lottie = Lottie.loadAnimation({
      container: anime.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: notFoundLoadingAnimation,
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

export default BaseNotFoundLottieLoader;
