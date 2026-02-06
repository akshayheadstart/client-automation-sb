import { SettingsOutlined } from "@mui/icons-material";
import { Box, Button, Tooltip } from "@mui/material";
import React from "react";
import AddDependentFieldDialog from "./AddDependentFieldDialog";

function AddDependentField({
  currentField,
  currentFieldIndex,
  fields,
  setFields,
}) {
  const [openConfigureDialog, setOpenConfigureDialog] = React.useState(false);

  return (
    <Box>
      {currentField.options?.length > 0 ? (
        <>
          <Button
            size="small"
            variant="outlined"
            color="info"
            endIcon={<SettingsOutlined />}
            onClick={() => setOpenConfigureDialog(true)}
          >
            Configure
          </Button>
        </>
      ) : (
        "N/A"
      )}
      {openConfigureDialog && (
        <AddDependentFieldDialog
          open={openConfigureDialog}
          setOpen={setOpenConfigureDialog}
          currentField={currentField}
          currentFieldIndex={currentFieldIndex}
          fields={fields}
          setFields={setFields}
        />
      )}
    </Box>
  );
}

export default AddDependentField;
