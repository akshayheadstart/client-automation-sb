import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import React from "react";
import "../../../styles/searchInputBox.css";
const SearchInputField = ({
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
      sx={{
        maxWidth: maxWidth,
        '& label': {
          color: 'white !important',
        },
        '& .MuiOutlinedInput-root': {
          '&:hover fieldset': {
            borderColor: 'white', 
          },
          '& fieldset': {
            borderColor: 'white !important',
            color: 'white !important',
          },
        },
        
      }}
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

export default SearchInputField;
