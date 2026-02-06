import { Paper, Popper, Typography } from "@mui/material";
import React from "react";
import ProgressBar from "../shared/forms/ProgessBar";

const PoperComponent = (props) => {
  const [arrowRef] = React.useState(null);
  return (
    <Popper
      placement="left"
      disablePortal={false}
      open={props?.openPopper}
      anchorEl={props?.anchorEl}
      modifiers={[
        {
          name: "flip",
          enabled: false,
          options: {
            altBoundary: false,
            rootBoundary: "document",
            padding: 8,
          },
        },
        {
          name: "preventOverflow",
          enabled: false,
          options: {
            altAxis: false,
            altBoundary: false,
            tether: false,
            rootBoundary: "viewport",
            padding: 8,
          },
        },
        {
          name: "arrow",
          enabled: true,
          options: {
            element: arrowRef,
          },
        },
      ]}
    >
      <div>
        <Paper
          sx={{
            maxWidth: 300,
            overflow: "auto",
            padding: `${props.index === 1 ? "10px" : "0px"}`,
            boxShadow:
              "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
          }}
        >
          {props.index === 1 && (
            <Typography variant="body2" fontWeight={"bold"}>
              {props?.title}
            </Typography>
          )}
          {props.index === 2 && props?.title && (
            <Typography variant="body2" fontWeight={"bold"} sx={{ p: 1 }}>
              {props?.title}
            </Typography>
          )}
          {props.index === 3 && props?.title && (
            <Typography variant="body2" fontWeight={"bold"} sx={{ p: 1 }}>
              {props?.title}
            </Typography>
          )}
          {props.index === 1 && (
            <ProgressBar
              bgcolor="#40c94e"
              progress={props?.percentage ? props?.percentage : 0}
              height="14px"
            />
          )}

          {props.index === 1 && (
            <Typography variant="body2" fontSize={"10px"}>
              Application {props?.subText}
            </Typography>
          )}
        </Paper>
      </div>
    </Popper>
  );
};

export default PoperComponent;
