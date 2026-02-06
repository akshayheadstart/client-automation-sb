import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import React from "react";
import "../../../styles/searchInputBox.css";
const SearchInputBox = ({
  setSearchText,
  searchText,
  maxWidth,
  className,
  type,
  color,
}) => {
  return (
    <TextField
      type={type ? type : "text"}
      onChange={(e) => setSearchText(e.target.value)}
      size="small"
      label="Search"
      color="info"
      sx={{ maxWidth: maxWidth }}
      className={className ? className : "large-search-box-text-field"}
      value={searchText}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton>
              {searchText ? (
                <CloseOutlinedIcon
                  color={color}
                  onClick={() => setSearchText("")}
                />
              ) : (
                <SearchOutlinedIcon color={color} />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
      variant="outlined"
    />
  );
};

export default SearchInputBox;
