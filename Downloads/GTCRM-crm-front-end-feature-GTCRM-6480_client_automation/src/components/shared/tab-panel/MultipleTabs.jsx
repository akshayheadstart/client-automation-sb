import React from "react";
import "../../../styles/multipleTabs.css";
import "../../../styles/sharedStyles.css";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

/**
 * MultipleTabs component for creating a tabbed interface.
 * @param {Object[]} tabArray - An array of tab objects, each containing a tabName.
 * @param {number} mapTabValue - The currently selected tab index.
 * @param {function} setMapTabValue - Function to set the selected tab index.
 */

const MultipleTabs = ({ tabArray, mapTabValue, setMapTabValue, boxWidth }) => {
  return (
    <Box
      className="segmented-button"
      sx={{
        width: boxWidth && boxWidth,
        whiteSpace: "nowrap",
      }}
    >
      {tabArray.map((tab, tabIndex) => (
        <Box
          key={tab.tabName} // Use a unique key for each tab
          className={`tab-box ${
            tabIndex === 0
              ? "left-side-box-tab"
              : tabIndex === tabArray.length - 1
              ? "right-side-box-tab"
              : "middle-side-box-tab"
          } ${mapTabValue === tabIndex ? "tab-active" : ""}`}
          sx={{
            width: tab?.width ? tab?.width : "320px",
            cursor: tab?.disable ? "not-allowed" : "pointer",
            color: "#039BDC",
          }}
          onClick={() => tab?.disable || setMapTabValue(tabIndex)}
        >
          {tab.tabName}
        </Box>
      ))}
    </Box>
  );
};

MultipleTabs.propTypes = {
  tabArray: PropTypes.arrayOf(
    PropTypes.shape({
      tabName: PropTypes.string.isRequired,
    })
  ),
  mapTabValue: PropTypes.number.isRequired,
  setMapTabValue: PropTypes.func.isRequired,
};

export default MultipleTabs;
