/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import {} from "lodash";
import { Badge, Tooltip } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { PickersDay, pickersDayClasses } from "@mui/x-date-pickers";

import "../../styles/CounselorFollowUpCalendar.css";

const CounselorFollowUpCalendarDay = (props) => {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const currentHighlightedDay = React.useMemo(
    () =>
      highlightedDays.filter((item) => {
        const month = props.day.month() + 1;
        return (
          item.date === props.day.date() &&
          item.month === month &&
          item.followUpCount < item.totalFollowUpCount
        );
      })[0] || null,
    [highlightedDays]
  );

  const isSelected = !props.outsideCurrentMonth && currentHighlightedDay;

  const renderTitle = () => {
    const { followUpCount, totalFollowUpCount } = currentHighlightedDay || {};
    const percentage =
      (Number(followUpCount) / Number(totalFollowUpCount)) * 100;

    return `Follow up: ${followUpCount}/${totalFollowUpCount} (${percentage}%)`;
  };

  return (
    <Badge
      key={props.day.toString()}
      badgeContent={
        <Tooltip
          classes={{
            popper: "day-dot-popper",
            tooltip: "day-dot-tooltip",
          }}
          title={renderTitle()}
          placement="right-start"
        >
          <CircleIcon data-testid="dot-icon" className="circle-icon" />
        </Tooltip>
      }
      className="dot-badge"
      invisible={!isSelected}
    >
      <PickersDay
        data-testid="pickers-day"
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        sx={{
          [`&&.${pickersDayClasses.selected}`]: {
            bgcolor: "#cceeff",
            color: "#007fff",
          },
        }}
      />
    </Badge>
  );
};

export default CounselorFollowUpCalendarDay;
