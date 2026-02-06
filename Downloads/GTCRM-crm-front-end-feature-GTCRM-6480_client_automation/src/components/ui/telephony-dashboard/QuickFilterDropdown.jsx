import React from "react";
import { Dropdown, Popover, Whisper } from "rsuite";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Box } from "@mui/system";
import { Checkbox } from "@mui/material";
import { telephonyQuickFilterList } from "../../../constants/LeadStageList";
function TelephonyQuickFilterDropdown({
  selectedQuickFilter,
  setSelectedQuickFilter,
}) {
  const renderMenu = ({ onClose, left, top, className }, ref) => {
    const handleSelect = (eventKey) => {
      setSelectedQuickFilter(selectedQuickFilter === eventKey ? "" : eventKey);
      onClose();
    };
    return (
      <Popover ref={ref} className={className} style={{ left, top }} full>
        <Dropdown.Menu onSelect={handleSelect}>
          {telephonyQuickFilterList.map((list) => (
            <Dropdown.Item key={list.label} eventKey={list.label}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Checkbox
                  checked={selectedQuickFilter === list.label}
                  sx={{
                    p: 0,
                    color: list.color,
                    "&.Mui-checked": {
                      color: list.color,
                    },
                  }}
                />{" "}
                {list.label}
              </Box>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Popover>
    );
  };

  return (
    <Whisper placement="bottomStart" trigger="click" speaker={renderMenu}>
      <ArrowDropDownIcon color="info" />
    </Whisper>
  );
}

export default TelephonyQuickFilterDropdown;
