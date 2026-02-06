import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  TextField,
} from "@mui/material";
import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
const FilterSaveDialog = ({
  openSaveFilterDialog,
  setOpenSaveFilterDialog,
  filterDataLoading,
  handleSaveFilters,
  filterSaveName,
  setFilterSaveName,
}) => {
  return (
    <Dialog
      open={openSaveFilterDialog}
      onClose={() => setOpenSaveFilterDialog(false)}
    >
      {filterDataLoading && (
        <Box
          className="filter-save-spinner"
          sx={{ display: "flex", justifyContent: "center", mt: 1 }}
        >
          <CircularProgress size={30} color="info" />
        </Box>
      )}
      <DialogTitle className="filter-save-dialog-title">
        Save filter
        <CancelIcon
          onClick={() => setOpenSaveFilterDialog(false)}
          sx={{
            color: (theme) => theme.palette.grey[500],
            cursor: "pointer",
          }}
        ></CancelIcon>
      </DialogTitle>
      <Box sx={{ px: 2, pb: 2 }}>
        <form onSubmit={handleSaveFilters}>
          <TextField
            sx={{ width: 300 }}
            label="Name of the filter"
            type="text"
            required
            onChange={(event) => setFilterSaveName(event.target.value)}
            value={filterSaveName}
            variant="outlined"
            color="info"
          />
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Button type="submit" className="common-contained-button">
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </Dialog>
  );
};

export default FilterSaveDialog;
