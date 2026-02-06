import { Box, Button, Typography } from "@mui/material"
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import '../styles/errorFallBack.css'
import SomethingWentWrongAnimation from "../components/shared/ErrorAnimation/SomethingWentWrongAnimation";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkEnvironment } from "../utils/BooelanConvertion";
export const ErrorFallback = ({ error, resetErrorBoundary }) => {

    const naviagte = useNavigate()

    useEffect(() => {
        if (checkEnvironment() === false) {
            setTimeout(() => {
                naviagte("/")
            }, 10000)
        }
    }, [naviagte])

    return (
        <>
            {checkEnvironment() === true && <Box id="error-card-container">
                <Box item xs={10} md={5} className="error-card">
                    <Box className="error-card-heading">
                        <ErrorOutlineIcon className="error-icon" />
                        <Typography variant="h4">Something went wrong:</Typography>
                        <pre style={{ color: 'red' }}>{error.message}</pre>
                        <pre style={{ color: 'red' }}>{error.stack}</pre>
                        <Button color='error' onClick={resetErrorBoundary} variant='contained'>Try again</Button>
                    </Box>
                </Box>
            </Box>}

            {checkEnvironment() === false && <Box id="error-card-container">
                <Box item xs={10} md={5} className="error-card">
                    <SomethingWentWrongAnimation height={400} width={400}></SomethingWentWrongAnimation>
                </Box>
            </Box>}
        </>
    )
}