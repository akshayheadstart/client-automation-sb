import { Box } from "@mui/material";
import React from "react";
import "../../../styles/sharedStyles.css";
import PropTypes from "prop-types";

/**
 * CustomTabs component for creating a tabbed interface.
 * @param {function} setTabNo - Function to set the active tab.
 * @param {number} tabNo - Active tab number.
 * @param {string} alignItems - CSS align-items property.
 * @param {string} justifyContent - CSS justify-content property.
 */
const CustomTabs = ({ setTabNo, tabNo, alignItems, justifyContent }) => {
  return (
    <Box
      onClick={() => {
        setTabNo(tabNo === 1 ? 2 : 1);
      }}
      className="custom-tab-box"
      sx={{
        alignItems: alignItems,
        justifyContent: justifyContent,
      }}
    >
      <Box className={tabNo === 1 ? "custom-tab-one" : "custom-tab-two"}></Box>
      <Box className={tabNo === 2 ? "custom-tab-one" : "custom-tab-two"}></Box>
    </Box>
  );
};
// Define PropTypes
CustomTabs.propTypes = {
  setTabNo: PropTypes.func.isRequired,
  tabNo: PropTypes.number,
  alignItems: PropTypes.string,
  justifyContent: PropTypes.string,
};

// Set default props
CustomTabs.defaultProps = {
  tabNo: 1,
  alignItems: "center",
  justifyContent: "center",
};
export default CustomTabs;
