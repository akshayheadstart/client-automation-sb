import { Box, Divider, Typography } from "@mui/material";
import React, { useContext } from "react";
import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";
import PhoneForwardedIcon from "@mui/icons-material/PhoneForwarded";
import "../../styles/callLogs.css";
import TimeLine from "./TimeLine";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
const CallLogs = (props) => {

  //getting data form context
  const {
    apiResponseChangeMessage
  } = useContext(DashboradDataContext);

  return (
    <>
      {props?.callLogsInternalServerError || props?.somethingWentWrongInCallLogs ? <Box>
        <Typography
          align="left"
          pl={2}
          variant="h6"
        >
          Call Logs
        </Typography>
        {props?.callLogsInternalServerError && <Error500Animation height={400} width={400}></Error500Animation>}
        {props?.somethingWentWrongInCallLogs && <ErrorFallback error={apiResponseChangeMessage} resetErrorBoundary={() => window.location.reload()} />}
      </Box> : <Box sx={{ display: props?.hideCallLogs ? "none" : "block" }}>
        <Box sx={{ pb: 1.5, pt: 1.5 }} id="call-log-tab-top-section">
          <Typography pl={2} variant="h6">
            {" "}
            Call Logs
          </Typography>
        </Box>
        <Divider></Divider>
        <Box sx={{ p: 2 }}>
          <Box className="call-log-summary">
            <Box className="  call-log-summary-box1">
              <Typography
                className="  call-log-text-color1"
                align="center"
                fontWeight="bold"
              >
                {props?.callLogs?.outbound_call}
              </Typography>
              <Typography align="center" fontSize="13px" marginBottom={1}>
                Outbound Call
              </Typography>
              <PhoneCallbackIcon></PhoneCallbackIcon>
            </Box>
            <Box className="  call-log-summary-box3">
              <Typography
                className="  call-log-text-color3"
                align="center"
                fontWeight="bold"
              >
                {props?.callLogs?.outbound_call_duration}
              </Typography>
              <Typography align="center" fontSize="13px" marginBottom={1}>
                Outbound Call Duration
              </Typography>
              <AccessTimeIcon />
            </Box>
            <Box className="  call-log-summary-box2">
              <Typography
                className="  call-log-text-color2"
                align="center"
                fontWeight="bold"
              >
                {props?.callLogs?.inbound_call}
              </Typography>
              <Typography align="center" fontSize="13px" marginBottom={1}>
                Inbound Call
              </Typography>
              <PhoneForwardedIcon></PhoneForwardedIcon>
            </Box>

            <Box className="  call-log-summary-box3">
              <Typography
                className="  call-log-text-color3"
                align="center"
                fontWeight="bold"
              >
                {props?.callLogs?.inbound_call_duration}
              </Typography>
              <Typography align="center" fontSize="13px" marginBottom={1}>
                Inbound Call Duration
              </Typography>
              <AccessTimeIcon />
            </Box>
          </Box>

          <TimeLine toggle={true} timeLineData={props?.callLogs?.call_timelines}></TimeLine>
        </Box>
      </Box>
      }
    </>

  );
};

export default CallLogs;
