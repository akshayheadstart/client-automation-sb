import React from "react";
import { Box } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CustomTooltip from "../Popover/Tooltip";

import "../../../styles/sharedStyles.css";
// When we need to send to custom function sorting we need to send addCustomFunction true and pass handleSortCustom props

const SortIndicatorWithTooltip = ({
  placement = "top",
  sortType,
  handleSortCustom,
  value,
  sortColumn,
  setSortType,
  setSortColumn,
  setSortObj,
  addCustomFunction,
}) => {
  const handleSortColumn = (columnName, arrowActionIcon) => {
    let sort = "";
    let sort_type = "";
    if (sortColumn === columnName) {
      if (sortType === arrowActionIcon) {
        sort = "";
        sort_type = "";
      } else {
        sort = columnName;
        sort_type = arrowActionIcon;
      }
    } else {
      sort = columnName;
      sort_type = arrowActionIcon;
    }
    setSortType(sort_type);
    setSortColumn(sort);
    setSortObj &&
      setSortObj({
        sort,
        sort_type,
      });
  };
  const renderIcons = () => (
    <Box className="sort-indicator-arrow-wrapper">
      <KeyboardArrowUpIcon
        data-testid="upArrow"
        className={sortType === "asc" ? "sort-indicator-active" : ""}
        onClick={() => {
          if (addCustomFunction) {
            handleSortCustom(value, "asc");
          } else {
            handleSortColumn(value, "asc");
          }
        }}
      />
      <KeyboardArrowDownIcon
        data-testid="downArrow"
        className={sortType === "dsc" ? "sort-indicator-active" : ""}
        onClick={() => {
          if (addCustomFunction) {
            handleSortCustom(value, "dsc");
          } else {
            handleSortColumn(value, "dsc");
          }
        }}
      />
    </Box>
  );
  return sortType ? (
    <CustomTooltip
      placement={placement}
      description={`Sort ${sortType === "asc" ? "Ascending" : "Descending"}`}
      component={renderIcons()}
    />
  ) : (
    renderIcons()
  );
};
export default SortIndicatorWithTooltip;
