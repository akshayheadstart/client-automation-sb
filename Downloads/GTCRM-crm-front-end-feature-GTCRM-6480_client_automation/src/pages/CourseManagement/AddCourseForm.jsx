import React from "react";
import { FormControl, FormControlLabel, Button, Switch } from "@mui/material";
import FormField from "../../components/shared/forms/FormField";
import { removeCharacters } from "../../utils/validation";

const AddCourseForm = ({
  isEditMode,
  onSubmit = () => {},
  onCancel = () => {},
  data = {},
}) => {
  const [name, setName] = React.useState(data.course_name || "");
  const [nameError, setNameError] = React.useState(false);
  const [description, setDescription] = React.useState(
    data.course_description || ""
  );
  const [duration, setDuration] = React.useState(
    Number(removeCharacters(data.duration)) || ""
  );
  const [fees, setFees] = React.useState(
    Number(removeCharacters(data.fees)) || ""
  );
  const [isActive, setIsActive] = React.useState(
    isEditMode ? data.is_activated : true
  );
  const [isPg, setIsPg] = React.useState(data.is_pg || false);

  const handleOnFormSubmit = (event) => {
    event.preventDefault();
    const payload = {
      ...data,
      course_name: name,
      course_description: description,
      duration: duration.toString(),
      fees: fees.toString(),
      is_activated: isActive,
      is_pg: isPg,
    };
    if (isEditMode) {
      payload.course_id = data._id;
      payload.course_specialization = null;
    }
    onSubmit(payload);
  };

  const handleCourseName = (text = "") => {
    if (text.match(/^[a-zA-Z0-9.]+$/g)) {
      setNameError(false);
    } else {
      setNameError(true);
    }
    setName(text);
  };

  return (
    <form onSubmit={handleOnFormSubmit}>
      <FormField
        value={name}
        onChange={(e) => handleCourseName(e.target.value)}
        placeholder="Enter course name"
        required={true}
        helperText={nameError ? "Please enter valid name" : "e.g. B. Tech"}
        error={nameError}
      />
      <FormField
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter description"
        multiline
        rows={3}
      />
      <FormField
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        placeholder="Enter duration"
        type="number"
        helperText="e.g. 3"
      />
      <FormField
        value={fees}
        onChange={(e) => setFees(e.target.value)}
        placeholder="Enter fees"
        required={true}
        type="number"
        helperText="e.g. 10000"
      />
      {isEditMode ? (
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
              onChange={(e) => setIsActive(e.target.checked)}
            />
          }
          label="Active"
        />
      ) : null}
      <br />
      <FormControlLabel
        labelPlacement="start"
        control={
          <Switch
            classes={{
              switchBase: "course-form-switch-base",
              checked: "switch-checked",
              track: "course-form-switch-track",
            }}
            checked={isPg}
            onChange={(e) => setIsPg(e.target.checked)}
          />
        }
        label="PG"
      />
      <FormControl className="center-align" fullWidth>
        <Button className="course-form-submit-btn center-align" type="submit">
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
  );
};

export default AddCourseForm;
