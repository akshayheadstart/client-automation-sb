import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

function useResponsive() {
  const theme = useTheme();

  const smUp = useMediaQuery(theme.breakpoints.up("sm")); // 600
  const mdUp = useMediaQuery(theme.breakpoints.up("md")); // 900

  return { smUp, mdUp };
}

export default useResponsive;
