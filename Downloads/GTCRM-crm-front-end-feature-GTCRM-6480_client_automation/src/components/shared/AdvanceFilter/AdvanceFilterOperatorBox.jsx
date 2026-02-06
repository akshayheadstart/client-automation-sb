import { Box, Typography } from "@mui/material";
import React from "react";
import { useRef } from "react";
import { Dropdown, Popover, Whisper } from "rsuite";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const AdvanceFilterOperatorBox = ({
  selectedValue,
  handleFilterOptionUpdate,
  options,
  index,
  blockId,
  from,
  preview,
}) => {
  const ref = useRef();

  return (
    <Box>
      <Whisper
        placement="bottom"
        controlId="control-id-with-dropdown"
        trigger={!preview && "click"}
        ref={ref}
        speaker={
          <Popover ref={ref} full arrow={false} style={{ zIndex: 2000 }}>
            <Dropdown.Menu
              onSelect={(keyIndex) => {
                ref.current.close();
                handleFilterOptionUpdate(
                  from === "field-name" ? "field-name" : "operator",
                  options[keyIndex],
                  index,
                  blockId
                );
              }}
            >
              {options?.map((value, index) => (
                <Dropdown.Item key={index} eventKey={index}>
                  {value}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Popover>
        }
      >
        <Box className="adv-filter-field-name-box">
          <Typography sx={{ color: from !== "field-name" && "#008be2" }}>
            {selectedValue
              ? selectedValue
              : from === "field-name"
              ? "Field Name"
              : "Operator"}
          </Typography>
          <KeyboardArrowDownIcon
            sx={{
              cursor: "pointer",
              color: from !== "field-name" && "#008be2",
              visibility:
                from === "field-name" && selectedValue ? "hidden" : "visible",
            }}
          />
        </Box>
      </Whisper>
    </Box>
  );
};

export default AdvanceFilterOperatorBox;
