import { Box } from '@mui/material';
import Lottie from 'lottie-web';
import React, { useEffect, useRef } from 'react';
import leafLoadingAnimation from "../../../images/lottieLeafLoadingAnimation.json";
const LeefLottieAnimationLoader = (props) => {

    const { height, width } = props
    const anime = useRef(null);
    useEffect(() => {
        const lottie = Lottie.loadAnimation({
            container: anime.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: leafLoadingAnimation,
        });
        return () => lottie.destroy()
    }, []);
    return (
        <Box sx={{ display: 'flex', justifyContent: "center", alignItems: 'center' }}>
            <Box className="full-width-height container" style={{ height: height, width: width }} ref={anime}></Box>
        </Box>
    );
};

export default LeefLottieAnimationLoader;