import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import AddFeaturePermissionDialog from "./AddFeaturePermissionDialog";

function FeaturePermissionHeader({
  title,
  setFeatureDashboard,
  featureDashboard,
  setAddedFeatures,
  addedFeatures,
}) {
  const [openAddFeatureDialog, setOpenAddFeatureDialog] = useState(false);
  return (
    <>
      <Box sx={{ mb: 2 }} className="feature-permission-heading">
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Box className="feature-permission-heading">
        <Autocomplete
          value={featureDashboard?.label}
          onChange={(_, value) => {
            setFeatureDashboard(value);
            setAddedFeatures([]);
          }}
          disablePortal
          options={[
            { label: "Student Dashboard", value: "student_dashboard" },
            { label: "Admin Dashboard", value: "admin_dashboard" },
          ]}
          sx={{ width: 300, my: 2 }}
          renderInput={(params) => (
            <TextField color="info" {...params} label="Select Dashboard" />
          )}
        />

        <Button
          disabled={!featureDashboard?.value?.length}
          variant="contained"
          color="info"
          onClick={setOpenAddFeatureDialog}
        >
          Add
        </Button>
      </Box>
      {openAddFeatureDialog && (
        <AddFeaturePermissionDialog
          open={openAddFeatureDialog}
          setOpen={setOpenAddFeatureDialog}
          featureDashboard={featureDashboard?.value}
          setAddedFeatures={setAddedFeatures}
        />
      )}
    </>
  );
}

export default FeaturePermissionHeader;
