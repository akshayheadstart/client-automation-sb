import { useMediaQuery } from '@mui/material';

const useBreakPointsEmailTemplates = (templatesLength) => {

    const matchMobile = useMediaQuery('(max-width:700px)');
    const matchTablet = useMediaQuery('(max-width:1100px)');
    const matchLaptop = useMediaQuery('(max-width:1450px)');
    const matchDesktop = useMediaQuery('(max-width:1850px)');
    const matchLargeDesktop = useMediaQuery('(max-width:2250px)');

    if (matchMobile) {
        return { default: 1 }
    } else if (matchTablet) {
        if (templatesLength > 1) {
            return { default: 1 }
        } else {
            return { default: templatesLength }
        }
    }
    else if (matchLaptop) {
        if (templatesLength > 2) {
            return { default: 2 }
        } else {
            return { default: templatesLength + 1 }
        }
    }
    else if (matchDesktop) {
        if (templatesLength > 3) {
            return { default: 3 }
        } else {
            return { default: templatesLength + 1 }
        }
    }
    else if (matchLargeDesktop) {
        if (templatesLength >= 4) {
            return { default: 4 }
        } else {
            return { default: templatesLength + 1 }
        }
    }
    else {
        if (templatesLength >= 5) {
            return { default: 5 }
        } else {
            return { default: templatesLength + 1 }
        }
    }
};

export default useBreakPointsEmailTemplates;