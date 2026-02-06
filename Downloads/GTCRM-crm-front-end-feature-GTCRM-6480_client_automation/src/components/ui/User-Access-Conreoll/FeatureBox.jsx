import React from "react";
import { Box, IconButton, Switch, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const FeatureBox = React.memo(
  ({
    colorClassName,
    mappingObject,
    state,
    setState,
    fieldName,
    showName,
    toolTip,
  }) => {
    return (
      <Box
        className={
          state[mappingObject.parent][mappingObject.child][fieldName]
            ? "feature-box-unable"
            : "feature-box-disable"
        }
      >
        <Box sx={{ paddingTop: "12px", paddingBottom: "2px" }}>
          <Switch
            size="medium"
            edge="end"
            onChange={() =>
              setState((prevState) => ({
                ...prevState,
                [mappingObject.parent]: {
                  ...prevState[mappingObject.parent],
                  [mappingObject.child]: {
                    ...prevState[mappingObject.parent][mappingObject.child],
                    [fieldName]:
                      !prevState[mappingObject.parent][mappingObject.child][
                        fieldName
                      ],
                  },
                },
              }))
            }
            checked={
              state[mappingObject.parent][mappingObject.child][fieldName]
            }
            inputProps={{
              "aria-labelledby": "switch-list-label-",
            }}
            color="info"
          />
        </Box>
        <Box sx={{ paddingBottom: "12px", px: 2 }}>
          <span className="feature-text"> {showName}</span>
          <Tooltip
            sx={{
              pl: 0.5,
              pr: 0,
              pt: 0,
              pb: 0,
              color: "#4a7adc",
              marginTop: "-3px",
            }}
            title={toolTip}
            arrow
            placement="top"
          >
            <IconButton>
              <InfoOutlinedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    );
  }
);

export default FeatureBox;
