import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import LeefLottieAnimationLoader from "../Loader/LeefLottieAnimationLoader";

export default function DateWisePanelAndSlotCount({
  from,
  dateWiseSlotPanelCount,
  isSlotPanelStatusFetching,
}) {
  return (
    <Box sx={{ mt: 4 }}>
      {isSlotPanelStatusFetching ? (
        <Box className="loading-animation">
          <LeefLottieAnimationLoader
            height={200}
            width={180}
          ></LeefLottieAnimationLoader>
        </Box>
      ) : (
        <>
          <Grid container spacing={0} className="panel-slot-details-container">
            {dateWiseSlotPanelCount?.slice(0, 3).map((item) => (
              <Grid item md={4} key={item.date}>
                <Box
                  className="panel-slot-details-box"
                  sx={{
                    border: item.isActive && "1px solid #039bdc",
                    borderRadius: "15px",
                    padding: `15px ${
                      from === "create-panel" ? "75px" : "38px"
                    }`,
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      textAlign: "center",
                      color: !item.isActive && "grey",
                    }}
                  >
                    {item.date}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textAlign: "center",
                      marginTop: "-15px",
                      color: !item.isActive && "grey",
                    }}
                  >
                    {item.day}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textAlign: "center",
                      lineHeight: 0.5,
                      mb: 1,
                      color: !item.isActive && "grey",
                    }}
                  >
                    |
                  </Typography>
                  <Typography variant="body1">
                    <span className="panel-slot-count">{item.panel_count}</span>{" "}
                    Number Panels
                  </Typography>
                  <Typography variant="body1">
                    <span className="panel-slot-count">{item.slot_count}</span>{" "}
                    Number Slots
                  </Typography>
                  <Typography variant="body1">
                    <span className="panel-slot-count">{item.time} hr</span>{" "}
                    Locked
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {from !== "create-panel" && (
            <Grid container className="panel-slot-details-container">
              {dateWiseSlotPanelCount?.slice(3, 6).map((item) => (
                <Grid item md={4} key={item.date}>
                  <Box
                    className="panel-slot-details-box"
                    sx={{
                      padding: `15px ${
                        from === "create-panel" ? "75px" : "38px"
                      }`,
                    }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        textAlign: "center",
                        color: !item.isActive && "grey",
                      }}
                    >
                      {item.date}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        textAlign: "center",
                        marginTop: "-15px",
                        color: !item.isActive && "grey",
                      }}
                    >
                      {item.day}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        textAlign: "center",
                        lineHeight: 0.5,
                        mb: 1,
                        color: !item.isActive && "grey",
                      }}
                    >
                      |
                    </Typography>
                    <Typography variant="body1">
                      <span className="panel-slot-count">
                        {item.panel_count}
                      </span>{" "}
                      Number Panels
                    </Typography>
                    <Typography variant="body1">
                      <span className="panel-slot-count">
                        {item.slot_count}
                      </span>{" "}
                      Number Slots
                    </Typography>
                    <Typography variant="body1">
                      <span className="panel-slot-count">{item.time} hr</span>{" "}
                      Locked
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
}
