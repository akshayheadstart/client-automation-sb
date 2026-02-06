import { FormHelperText, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { generalNumberValidation } from "../forms/Validation";
const CreateInterviewHeaderViewAfterSelectFilter = ({
  clickedFilterIcon,
  setClickedFilterIcon,
  listName,
  totalApplications,
  pickTop,
  setPickTop,
}) => {
  return (
    <Box className="header-after-select-filter">
      <Box>
        <Typography>{listName}</Typography>
      </Box>
      <Box>
        <Box className="header-after-select-filter" sx={{ gap: 2.5 }}>
          <Box>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h5">{totalApplications}</Typography>
          </Box>
          <Box>
            <Box>
              <TextField
                value={pickTop > totalApplications ? "" : pickTop}
                onChange={(e) => {
                  if (e.target.value > totalApplications) {
                    e.preventDefault();
                  } else {
                    setPickTop(e.target.value);
                  }
                }}
                label="Pick Top"
                type="number"
                size="small"
                onKeyDown={(e) => {
                  generalNumberValidation(e);
                  if (e.key > totalApplications) {
                    e.preventDefault();
                  }
                }}
                sx={{
                  width: 130,
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
              />
              <FormHelperText sx={{ color: "#FFB020" }}>
                Please press Enter key
              </FormHelperText>
            </Box>
          </Box>
          <Box
            className="select-filter-icon"
            onClick={() => setClickedFilterIcon((prev) => !prev)}
          >
            <FilterAltOutlinedIcon
              sx={{ color: clickedFilterIcon ? "#15f2ff !important" : "" }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateInterviewHeaderViewAfterSelectFilter;
