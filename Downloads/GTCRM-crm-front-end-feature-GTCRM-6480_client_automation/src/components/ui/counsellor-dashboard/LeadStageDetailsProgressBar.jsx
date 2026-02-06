import React from "react";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { Box, Typography } from "@mui/material";
import { BootstrapTooltip } from "../../shared/Tooltip/BootsrapTooltip";
import "../../../styles/LeadStageDetails.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,

  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#0190E1" : "#308FE8",
  },
}));

const LeadStageDetailsProgressBar = ({ stage, normalise }) => {
  const navigate = useNavigate();
  // const hyperLinkPermission = useSelector(
  //   (state) =>
  //     state.authentication.permissions.menus?.dashboard?.admin_dashboard
  //       ?.features?.hyper_link
  // );
  return (
    <Box className="lead-stage-details-progressbar-box">
      <Box className="lead-stage-name-value-box">
        <BootstrapTooltip
          arrow
          title={
            stage?.subStage?.length > 0
              ? stage?.subStage?.map((sub) => {
                  return (
                    <Box className="sub-stage-text-value-box">
                      <Typography className="sub-stage-text">
                        {sub?.name}
                      </Typography>
                      <Typography className="sub-stage-text">
                        ({sub?.total})
                      </Typography>
                    </Box>
                  );
                })
              : ""
          }
          placement="right"
          backgroundColor="#11BED2"
        >
          <Typography className="lead-stage-text">{stage?.name}</Typography>
        </BootstrapTooltip>
        <Typography
          sx={{ cursor: stage.navigate ? "pointer" : "" }}
          onClick={() => {
            // if (hyperLinkPermission) {
            if (stage?.navigate) {
              navigate(stage?.navigate, {
                state: stage?.navigateState,
              });
            }
            // }
          }}
          className="lead-stage-value"
        >
          {stage?.value}
        </Typography>
      </Box>
      <BorderLinearProgress
        variant="determinate"
        value={normalise(stage?.value ? stage?.value : 0)}
      />
    </Box>
  );
};

export default LeadStageDetailsProgressBar;
