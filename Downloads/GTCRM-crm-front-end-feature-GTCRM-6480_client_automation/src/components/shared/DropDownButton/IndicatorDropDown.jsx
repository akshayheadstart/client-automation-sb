import { Box } from "@mui/material";
import React, { useState } from "react";
import { BootstrapTooltip } from "../Tooltip/BootsrapTooltip";
import "../../../styles/indicatorDropDown.css";
import { Dropdown } from "rsuite";

const IndicatorDropDown = ({
  indicator,
  image,
  indicatorValue,
  setIndicator,
  position = "bottomEnd",
  cssID,
  showToolTip = true,
  setPageNumber,
  page,
  setDataValue
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const indicatorText = indicator
    ? indicator.includes("_")
      ? indicator.split("_").join(" ")
      : indicator
    : "Last 7 days";

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleIndicatorChange = (value) => {
    setIndicator(value);
    handleClose();
    if(page){
      setPageNumber(1)
      setDataValue([])
    }
  };

  const renderMenuItems = () => {
    return indicatorValue.map((indicatorObject, indicatorIndex) => (
      <Dropdown.Item
        key={indicatorIndex}
        onClick={() => handleIndicatorChange(indicatorObject?.value)}
      >
        {indicatorObject?.label}
      </Dropdown.Item>
    ));
  };

  const renderIconButton = (props, ref) => {
    return (
      <div ref={ref} {...props}>
        <BootstrapTooltip
          arrow
          title={showToolTip && indicatorText}
          placement="top"
          backgroundColor="#09a4da"
        >
          <Box
            id={cssID ? cssID : "indicatorDesign"}
            aria-controls={open ? "basic-menu-indicator" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <img style={{ width: "100%" }} src={image} alt="Indicator" />
          </Box>
        </BootstrapTooltip>
      </div>
    );
  };
  return (
    <React.Fragment>
      <Dropdown placement={position} renderToggle={renderIconButton}>
        {renderMenuItems()}
      </Dropdown>
    </React.Fragment>
  );
};

export default IndicatorDropDown;
