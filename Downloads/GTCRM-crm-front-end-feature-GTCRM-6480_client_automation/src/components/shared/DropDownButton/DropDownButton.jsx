import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
} from "@mui/material";

import React, { useState } from "react";
import { ChevronDown as ChevronDownIcon } from "../../../icons/ChevronDown";
const DropDownButton = ({ buttonName, options, setSchool, school }) => {
  const handleChange = (event) => {
    setSchool(event.target.value);
  };

  return (
    <Box>
      {/* <Button
        id="action-button"
        aria-controls={open ? "action-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        endIcon={<ChevronDownIcon fontSize="small" />}
        size="large"
        variant="text"
      >
        {buttonName}
      </Button>
      <Menu
        id="action-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "action-button",
        }}
      >
        {options.length > 0 ? (
          options.map((item) => (
            <MenuItem
              onClick={() => {
                setSchool(item);
                handleClose();
              }}
            >
              {item}
            </MenuItem>
          ))
        ) : (
          <MenuItem onClick={handleClose}>No Options</MenuItem>
        )}
      </Menu> */}
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{buttonName}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={school}
          label={buttonName}
          onChange={handleChange}
        >
          {options.length > 0 ? (
            options.map((item) => <MenuItem value={item}>{item}</MenuItem>)
          ) : (
            <MenuItem value={null}>No Options</MenuItem>
          )}
        </Select>
      </FormControl>
    </Box>
  );
};

export default DropDownButton;
