import React from "react";
import { Button, CircularProgress, FormControl } from "@mui/material";
import FormField from "../../components/shared/forms/FormField";
import { validateInputText } from "../../utils/ResourceUtils";

import "../../styles/Resources.css";
import SaveConfirmDialog from "./SaveConfirmDialog";

const CreateSegregationForm = ({
  onSubmit = () => {},
  onCancel = () => {},
  loading,
  data,
}) => {
  const [tagName, setTagName] = React.useState(data?.category_name || "");
  const [tagNameError, setTagNameError] = React.useState(false);

  const handleOnFormSubmit = (event) => {
    event.preventDefault();
    if (tagName.trim().length) {
      const payload = {
        category_name: tagName.trim(),
      };

      onSubmit(payload);
    } else {
      setTagNameError(true);
    }
  };

  const handleTagName = (text) => {
    if (validateInputText(text)) {
      setTagNameError(false);
    } else {
      setTagNameError(true);
    }
    setTagName(text);
  };
  const [saveConfirmOpen, setSaveConfirmOpen] = React.useState(false);

  const handleSaveConfirmClickOpen = () => {
    setSaveConfirmOpen(true);
  };

  const handleSaveConfirmClose = () => {
    setSaveConfirmOpen(false);
  };
  return (
    <>
    <form style={{ position: "relative" }} onSubmit={handleOnFormSubmit}>
      <FormField
        value={tagName}
        onChange={(e) => handleTagName(e.target.value)}
        placeholder="Category Name"
        required={true}
        helperText={
          tagNameError ? "Please enter valid Tag name" : "e.g. Eligibility"
        }
        error={tagNameError}
      />
      <FormControl className="center-align-items" fullWidth>
        {loading ? (
          <CircularProgress size={22} color="info" />
        ) : (
          <Button
            classes={{
              disabled: "save-btn-disabled",
            }}
            disabled={tagNameError || loading || !tagName}
            className="resource-form-submit-btn center-align-items"
            type="submit"
          >
            Save
          </Button>
        )}
        <Button
          className="resource-form-cancel-btn center-align-items"
          type="button"
          onClick={()=>{handleSaveConfirmClickOpen();}}
        >
          Cancel
        </Button>
      </FormControl>
    </form>
    {
      saveConfirmOpen && <SaveConfirmDialog handleSaveConfirmClose={handleSaveConfirmClose}
      saveConfirmOpen={saveConfirmOpen}
      handleOnCreateQuestionFormSubmit={handleOnFormSubmit}
      onCancel={onCancel}
      loading={loading}
      saveButtonActive={tagName}
      />
    }
    </>
  );
};

export default CreateSegregationForm;
