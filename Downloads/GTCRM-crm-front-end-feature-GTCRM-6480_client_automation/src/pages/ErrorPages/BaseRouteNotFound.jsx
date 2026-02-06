import { Box, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BaseNotFoundLottieLoader from '../../components/shared/Loader/BaseNotFoundLottieLoader';
import '../../styles/ErrorPages.css';

const BaseRouteNotFound = () => {

    const navigate = useNavigate();

    setTimeout(() => {
        navigate('/')
    }, 3000);

    return (
        <Box className="error-pages-layout">
            <Typography className="error-pages-title" variant="h3">Base Route Permission Not Found</Typography>
            <Typography className="error-pages-subtitle" variant="body1">Ask Admin to set your base route</Typography>
            <Box
                sx={{
                    width: "100%",
                    minHeight: "70vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {" "}
                <BaseNotFoundLottieLoader
                    height={400}
                    width={500}
                ></BaseNotFoundLottieLoader>{" "}
            </Box>

        </Box>

    );
};

export default BaseRouteNotFound;