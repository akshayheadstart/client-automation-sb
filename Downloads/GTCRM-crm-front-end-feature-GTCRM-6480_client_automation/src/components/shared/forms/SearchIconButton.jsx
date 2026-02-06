import { IconButton } from "@mui/material";
import React from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
const SearchIconButton = ({ setClickedSearchIcon, sx, color }) => {
  return (
    <IconButton
      onClick={() => setClickedSearchIcon(true)}
      sx={{ border: "1px solid white", borderRadius: 1, ...sx }}
    >
      {" "}
      <SearchOutlinedIcon color={color} />
    </IconButton>
  );
};

export default SearchIconButton;
