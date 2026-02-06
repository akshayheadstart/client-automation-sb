import { Grid } from "@mui/material";
import React, { useEffect } from "react";
import { QuillEditor } from "../../../userProfile/quilEditor/quilEditor";

function TermsAndConditionField({
  formikValue,
  setFieldValue,
  fieldName,
  placeholder,
}) {
  useEffect(() => {
    const qlEditor = document.querySelectorAll(".ql-editor");
    qlEditor.forEach((editor) => {
      editor.style.overflow = "auto";
      editor.classList.add("vertical-scrollbar");
    });
  }, [fieldName]);

  return (
    <Grid item md={6} sm={6} xs={12}>
      <QuillEditor
        value={formikValue}
        onChange={(content) => setFieldValue(fieldName, content)}
        placeholder={placeholder}
      />
    </Grid>
  );
}

export default React.memo(TermsAndConditionField);
