import React from "react";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

/**
 * MultipleTabs component for creating a tabbed interface.
 * @param {Object[]} tabArray - An array of tab objects, each containing a tabName.
 * @param {number} mapTabValue - The currently selected tab index.
 * @param {function} setMapTabValue - Function to set the selected tab index.
 */

const AutomationDetailsTab = ({ tabArray, mapTabValue, setMapTabValue }) => {
  return (
    <Box
      className="automation-segmented-button-container"
      sx={{
        whiteSpace: "nowrap",
      }}
    >
      {tabArray.map((tab, tabIndex) => (
        <Box
          key={tab.tabName} // Use a unique key for each tab
          className={`automation-segmented-button ${
            mapTabValue === tabIndex ? "automation-segmented-active-tab" : ""
          }`}
          onClick={() => tab?.disable || setMapTabValue(tabIndex)}
        >
          {tab.tabName}
        </Box>
      ))}
    </Box>
  );
};

AutomationDetailsTab.propTypes = {
  tabArray: PropTypes.arrayOf(
    PropTypes.shape({
      tabName: PropTypes.string.isRequired,
    })
  ),
  mapTabValue: PropTypes.number.isRequired,
  setMapTabValue: PropTypes.func.isRequired,
};

export default AutomationDetailsTab;
