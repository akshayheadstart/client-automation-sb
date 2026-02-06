import React from "react";
import {
  FormControl,
  Button,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import FormField from "../../components/shared/forms/FormField";
import ConfirmationDialog from "../../components/shared/Dialogs/ConfirmationDialog";

const SpecializationForm = ({
  onCancel = () => {},
  onSubmit = () => {},
  data = {},
  editSpecData = {},
}) => {
  const isNullSpecialization = editSpecData?.spec_name === null;
  const [open, setOpen] = React.useState(false);
  const [specialization, setSpecialization] = React.useState(
    editSpecData?.spec_name || ""
  );
  const [specNameError, setSpecError] = React.useState(false);
  const [isActive, setIsActive] = React.useState(editSpecData?.is_activated);
  const [isAllSpecsInactive, setIsAllSoecsInactive] = React.useState(false);

  const handleOnSpecFormSubmit = (event) => {
    event?.preventDefault();
    const newSpec = {
      spec_name: isNullSpecialization ? null : specialization,
      is_activated: true,
    };

    if (editSpecData) {
      newSpec.spec_index = editSpecData.index;
      newSpec.is_activated = isActive;
    }

    const payload = [newSpec];
    onSubmit(data, payload, isAllSpecsInactive);
    setOpen(false);
  };

  const handleActiveToggle = (e) => {
    let totalSpecs = data.course_specialization || [];
    totalSpecs = totalSpecs.map((item) => {
      return {
        ...item,
        is_activated:
          item.index === editSpecData.index
            ? e.target.checked
            : item.is_activated,
      };
    });
    const isAllInactive = totalSpecs?.every(
      (item) => item.is_activated === false
    );
    setIsAllSoecsInactive(isAllInactive);
    setIsActive(e.target.checked);
  };

  const handleSave = () => {
    setOpen(true);
  };

  const handleSpecName = (text = '') => {
    if(text.match(/^[a-zA-Z0-9.]+$/g)) {
      setSpecError(false);
    } else {
      setSpecError(true);
    }
    setSpecialization(text);
  }

  return (
    <>
      <form onSubmit={handleOnSpecFormSubmit}>
        <FormField
          value={isNullSpecialization ? "No Specialization" : specialization}
          onChange={(e) => handleSpecName(e.target.value)}
          placeholder="Enter specialization"
          required={true}
          disabled={isNullSpecialization}
          helperText={specNameError ? "Please enter valid name" : "e.g. Civil Engineering"}
          error={specNameError}
        />

        {editSpecData ? (
          <FormControlLabel
            labelPlacement="start"
            control={
              <Switch
                classes={{
                  switchBase: "course-form-switch-base",
                  checked: "switch-checked",
                  track: "course-form-switch-track",
                }}
                checked={isActive}
                onChange={(e) => handleActiveToggle(e)}
              />
            }
            label="Active"
          />
        ) : null}

        <FormControl className="center-align" fullWidth>
          <Button
            onClick={handleSave}
            className="course-form-submit-btn center-align"
            type="button"
          >
            Save
          </Button>
          <Button
            className="course-form-cancel-btn center-align"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </FormControl>
      </form>
      <ConfirmationDialog
        title="Confirm"
        message={
          <>
            <Typography component="p">Are you sure?</Typography>
            {isAllSpecsInactive ? (
              <Typography className="disable-all-spec-note" component="p">
                <strong className="note-label">Note: </strong>Do you want to disable all
                specializations?
              </Typography>
            ) : null}
          </>
        }
        handleClose={() => setOpen(false)}
        handleOk={() => handleOnSpecFormSubmit()}
        open={open}
      />
    </>
  );
};
export default SpecializationForm;
