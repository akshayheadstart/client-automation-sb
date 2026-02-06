import { SettingsOutlined } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import React, { useContext, useState } from "react";
import ValidationDialog from "./ValidationDialog";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";

function AddFieldValidations({
  currentField,
  fields,
  setFields,
  setCustomFieldValidation,
}) {
  const [openValidationDialog, setOpenValidationDialog] = useState(false);
  const { setTargetKeyPath } = useContext(DashboradDataContext);

  return (
    <Box>
      {currentField?.options ? (
        <Button size="small" variant="outlined" color="info" disabled>
          {setCustomFieldValidation && "Validations"} N/A
        </Button>
      ) : (
        <Button
          size="small"
          variant="outlined"
          color="info"
          endIcon={<SettingsOutlined />}
          disabled={!currentField?.field_type}
          onClick={() => {
            setOpenValidationDialog(true);
            setTargetKeyPath((prev) => [...prev, currentField?.key_name]);
          }}
        >
          Configure {setCustomFieldValidation && "Validations"}
        </Button>
      )}
      {openValidationDialog && (
        <ValidationDialog
          open={openValidationDialog}
          setOpen={setOpenValidationDialog}
          currentField={currentField}
          fields={fields}
          setFields={setFields}
          setCustomFieldValidation={setCustomFieldValidation}
        />
      )}
    </Box>
  );
}

export default AddFieldValidations;
