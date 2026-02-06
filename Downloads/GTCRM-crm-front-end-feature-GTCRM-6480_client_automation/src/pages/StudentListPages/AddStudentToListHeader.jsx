import {
  Box,
  CircularProgress,
  ClickAwayListener,
  FormHelperText,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SearchInputBox from "../../components/shared/forms/SearchInputBox";
import SearchIconButton from "../../components/shared/forms/SearchIconButton";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
const AddStudentToListHeader = ({
  searchText,
  setSearchText,
  handleSearchApiCall,
  handleAddStudentToList,
  loadingAddStudent,
  hasSelectedStudent,
  setClickedAddStudentButton,
}) => {
  const [clickedSearchIcon, setClickedSearchIcon] = useState(false);

  return (
    <Box
      sx={{ px: { md: 4.5, sm: 3.5, xs: 3 }, py: { md: 3, sm: 2.5, xs: 2 } }}
      className="add-student-to-list-header-container"
    >
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography>Please select the students you want to add. </Typography>
        <IconButton onClick={() => setClickedAddStudentButton(false)}>
          <ArrowForwardIosOutlinedIcon />
        </IconButton>
      </Box>
      <Box className="search-and-add-actions-container">
        <ClickAwayListener onClickAway={() => setClickedSearchIcon(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchApiCall();
            }}
          >
            <Box>
              {clickedSearchIcon ? (
                <>
                  <SearchInputBox
                    clickedTextField={clickedSearchIcon}
                    setSearchText={setSearchText}
                    searchText={searchText}
                  />
                  <FormHelperText sx={{ color: "#FFB020" }}>
                    Please press Enter key
                  </FormHelperText>
                </>
              ) : (
                <SearchIconButton setClickedSearchIcon={setClickedSearchIcon} />
              )}
            </Box>
          </form>
        </ClickAwayListener>
        {loadingAddStudent ? (
          <CircularProgress size={35} color="info" />
        ) : (
          <Box className="add-button">
            <button
              disabled={hasSelectedStudent ? false : true}
              onClick={() => handleAddStudentToList()}
            >
              {" "}
              <AddOutlinedIcon /> Add Students
            </button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AddStudentToListHeader;
