import { styled, Tooltip, tooltipClasses } from "@mui/material";

export const BootstrapTooltip = styled(
  ({ className, backgroundColor, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  )
)(({ theme, backgroundColor }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: backgroundColor ? backgroundColor : theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: backgroundColor
      ? backgroundColor
      : theme.palette.common.black,
  },
}));

//! <BootstrapTooltip arrow  placement="top/left/right/bottom" title="Any name"> when import
