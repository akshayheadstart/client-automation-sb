import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@mui/material";

const TemplateShowInfoDialog = ({
  openTemplateShowInfoDialog,
  handleCloseTemplateShowInfoDialog,
  title,
  subTitle,
  templateDetails,
  addTemplateShowInfo,
  handleCloseAddTemplateDialog,
}) => {
  const formik = useFormik({
    initialValues: {
      canRepeatTemplate: templateDetails?.table?.can_repeat_template
        ? templateDetails?.table?.can_repeat_template
        : templateDetails?.can_repeat_template || false,
      repeatCount: templateDetails?.table?.repeat_count
        ? templateDetails?.table?.repeat_count
        : templateDetails?.repeat_count || null,
      initialRowCount: templateDetails?.table?.initial_row_count
        ? templateDetails?.table?.initial_row_count
        : templateDetails?.initial_row_count || null,
      requiredRowCount: templateDetails?.table?.headers
        ? templateDetails?.table?.mandatory_row
        : templateDetails?.mandatory_row || null,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      const updatedField = {
        can_repeat_template: values.canRepeatTemplate,
        repeat_count: values.repeatCount,
      };

      if (templateDetails?.table?.headers?.length > 0) {
        updatedField.mandatory_row = values.requiredRowCount;
        updatedField.initial_row_count = values.initialRowCount;
      }

      addTemplateShowInfo(updatedField);

      handleCloseTemplateShowInfoDialog();
      handleCloseAddTemplateDialog();
    },
  });

  return (
    <React.Fragment>
      <Dialog
        open={openTemplateShowInfoDialog}
        onClose={handleCloseTemplateShowInfoDialog}
        fullWidth
      >
        <DialogTitle>{title}</DialogTitle>

        <DialogContent sx={{ py: 6 }}>
          <DialogContentText>{subTitle}</DialogContentText>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} sx={{ my: 2 }}>
              <Grid item md={6} xs={12}>
                <FormControl required color="grey">
                  <FormLabel>Can User Repeat this template?</FormLabel>
                  <RadioGroup
                    row
                    value={formik.values.canRepeatTemplate}
                    onChange={(event) => {
                      formik.setFieldValue(
                        "canRepeatTemplate",
                        event.target.value === "true"
                      );
                    }}
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio color="info" />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio color="info" />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {formik.values.canRepeatTemplate === true && (
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    id="repeatCount"
                    name="repeatCount"
                    label="How many time's can repeat?"
                    color="info"
                    type="number"
                    value={formik.values.repeatCount}
                    onChange={formik.handleChange}
                  />
                </Grid>
              )}

              {templateDetails?.table?.headers?.length && (
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    id="initialRowCount"
                    name="initialRowCount"
                    label="Initial Row Count"
                    type="number"
                    color="info"
                    value={formik.values.initialRowCount}
                    onChange={formik.handleChange}
                  />
                </Grid>
              )}

              {templateDetails?.table?.headers?.length && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="requiredRowCount"
                    name="requiredRowCount"
                    label="Required Row Count"
                    color="info"
                    type="number"
                    value={formik.values.requiredRowCount}
                    onChange={formik.handleChange}
                  />
                </Grid>
              )}
            </Grid>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Button
                onClick={handleCloseTemplateShowInfoDialog}
                color="info"
                variant="outlined"
                sx={{ mt: 4, borderRadius: 30 }}
              >
                Cancel
              </Button>

              <Button
                color="info"
                variant="contained"
                type="submit"
                sx={{ mt: 4, borderRadius: 30 }}
              >
                Save
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default TemplateShowInfoDialog;
