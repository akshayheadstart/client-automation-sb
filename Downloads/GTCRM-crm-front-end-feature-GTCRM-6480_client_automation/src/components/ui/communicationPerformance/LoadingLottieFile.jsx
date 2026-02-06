import { Box } from '@mui/material'
import React from 'react'
import LeefLottieAnimationLoader from '../../shared/Loader/LeefLottieAnimationLoader'

function LoadingLottieFile({ height }) {
    return (
        <Box className="communication-performance-loading" sx={{ height: height }}>
            <LeefLottieAnimationLoader
                height={150}
                width={100}
            ></LeefLottieAnimationLoader>
        </Box>
    )
}

export default LoadingLottieFile