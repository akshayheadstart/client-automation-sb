import { IconButton, InputAdornment, TextField } from "@mui/material";
import React from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import "../../../styles/searchInputBox.css";
const SearchBox = ({
  setSearchText,
  searchText,
  maxWidth,
  className,
  type,
  setPageNumber,
  setAllDataFetched,
  searchIconClassName = "",
  InputProps = {},
  InputLabelProps = {},
  searchBoxColor,
  onKeyDown,
}) => {
  return (
    <TextField
      onKeyDown={onKeyDown}
      color={searchBoxColor}
      type={type ? type : "text"}
      onChange={(e) => {
        setSearchText(e.target.value);
        setPageNumber(1);
        setAllDataFetched(false);
      }}
      size="small"
      label="Search"
      className={className ? className : "large-search-box-text-field2"}
      value={searchText}
      sx={{
        maxWidth: maxWidth,
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton>
              {searchText ? (
                <CloseOutlinedIcon onClick={() => setSearchText("")} />
              ) : (
                <SearchOutlinedIcon className={searchIconClassName} />
              )}
            </IconButton>
          </InputAdornment>
        ),
        ...InputProps,
      }}
      InputLabelProps={{
        ...InputLabelProps,
      }}
      variant="outlined"
    />
  );
};

export default SearchBox;
