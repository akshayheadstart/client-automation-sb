import React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Button, Popover, Whisper } from "rsuite";
import { Box, Checkbox, Typography } from "@mui/material";

const QuickDropdownFilters = ({ handleApplyQuickFilters, quickFilterList }) => {
  const triggerRef = React.useRef();
  const speaker = (
    <Popover style={{ zIndex: 2000 }}>
      {quickFilterList?.map((filter) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Checkbox
            checked={filter?.isChecked}
            onChange={(e) => {
              if (e.target.checked) {
                filter.setStateValue(filter?.value);
              } else {
                if (typeof filter.stateValue === "string") {
                  filter.setStateValue("");
                } else if (typeof filter?.stateValue === "boolean") {
                  filter.setStateValue(false);
                } else {
                  filter.setStateValue([]);
                }
              }
            }}
            sx={{
              p: 0.6,
              color: filter.color,
              "&.Mui-checked": {
                color: filter.color,
              },
            }}
          />{" "}
          <Typography variant="body2"> {filter.label}</Typography>
        </Box>
      ))}
      <Box
        sx={{
          mt: 1,
          textAlign: "center",
        }}
      >
        <Button
          onClick={() => {
            handleApplyQuickFilters();
            triggerRef.current.close();
          }}
          color="blue"
          size="sm"
          appearance="primary"
        >
          Apply
        </Button>
      </Box>
    </Popover>
  );
  return (
    <Whisper
      ref={triggerRef}
      placement="bottomStart"
      trigger="click"
      speaker={speaker}
    >
      <ArrowDropDownIcon color="info" />
    </Whisper>
  );
};

export default React.memo(QuickDropdownFilters);
