import { Box, ClickAwayListener } from "@mui/material";
import React, { useState } from "react";
import { DateRangePicker } from "rsuite";
import addDays from "date-fns/addDays";
import subDays from "date-fns/subDays";
import DateRangeIcon from "../../../icons/date-range-icon.svg";
function IconDateRangePicker({
  onChange,
  dateRange,
  disabled,
  defaultSize,
  customWidthHeight,
}) {
  const [showDateRange, setShowDateRange] = useState(false);
  const predefinedBottomRanges = [
    {
      label: "Today",
      value: [new Date(), new Date()],
    },
    {
      label: "Yesterday",
      value: [addDays(new Date(), -1), addDays(new Date(), -1)],
    },

    {
      label: "Last 7 days",
      value: [subDays(new Date(), 6), new Date()],
    },
    //for reset
    {
      label: "Reset",
      value: [1, 1],
    },
  ];

  return (
    <>
      <ClickAwayListener onClickAway={() => setShowDateRange(false)}>
        <Box
          sx={{
            cursor: disabled ? "not-allowed" : "pointer",
            width: customWidthHeight || (defaultSize ? "auto" : "35px"),
            height: customWidthHeight || (defaultSize ? "auto" : "35px"),
          }}
        >
          <img
            onClick={() => !disabled && setShowDateRange((prev) => !prev)}
            src={DateRangeIcon}
            alt="date-range-icon"
            width="100%"
            height="100%"
          />
          <Box
            sx={{
              position: "relative",
              display: showDateRange ? "block" : "none",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <DateRangePicker
              placeholder="Date Range"
              disabled={disabled}
              onOk={() => setShowDateRange(false)}
              ranges={predefinedBottomRanges}
              open={showDateRange}
              value={dateRange?.length ? dateRange : null}
              appearance="subtle"
              onChange={(value) => {
                if (value[0] === 1 && value[1] === 1) {
                  onChange([]);
                } else {
                  onChange(value);
                }
                setShowDateRange(false);
              }}
              placement="auto"
              className="date-range-btn select-picker hide-date-range-picker-field"
            />
          </Box>
        </Box>
      </ClickAwayListener>
    </>
  );
}

export default IconDateRangePicker;
