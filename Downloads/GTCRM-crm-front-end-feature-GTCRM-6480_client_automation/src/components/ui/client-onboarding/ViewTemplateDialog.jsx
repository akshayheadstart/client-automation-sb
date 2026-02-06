import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import FormFields from "../../shared/ClientRegistration/FormFields";
import useToasterHook from "../../../hooks/useToasterHook";

const ViewTemplateDialog = ({
  open,
  handleCloseDialog,
  title,
  subTitle,
  templateDetails,
  handleAddFieldsInTemplate,
  sectionIndex,
  handleAddCustomField,
  handleDeleteField,
  tableTemplateData,
  setTableTemplateData,
  setSelectedTableTemplateRow,
  setOpenTemplateShowInfoDialog,
}) => {
  const pushNotification = useToasterHook();

  const checkEmptyRow = (data) => {
    const emptyFieldRow = data?.table?.rows?.some(
      (row) => row.field_name.trim() === ""
    );

    if (emptyFieldRow) {
      pushNotification("warning", "Please add field");
    } else {
      setOpenTemplateShowInfoDialog(true);
    }
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mr: 4,
            pt: 2,
          }}
        >
          <DialogTitle>{title}</DialogTitle>
        </Box>

        <DialogContent sx={{ pb: 12 }}>
          <DialogContentText>{subTitle}</DialogContentText>

          <Box sx={{ mb: 2, p: 2, bgcolor: "#f9f9f9", borderRadius: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {templateDetails.section_title || "Untitled"}
                </Typography>

                <Typography
                  variant="subtitle1"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {templateDetails.section_subtitle || "No subtitle"}
                </Typography>
              </Box>
            </Box>

            <FormFields
              heading={templateDetails?.section_title}
              fieldDetails={
                templateDetails?.table
                  ? templateDetails
                  : templateDetails?.fields
              }
              preview={false}
              handleAddFields={handleAddFieldsInTemplate}
              sectionIndex={sectionIndex}
              handleAddCustomField={handleAddCustomField}
              handleDeleteField={handleDeleteField}
              showTable={templateDetails?.table ? true : false}
              tableTemplateData={tableTemplateData}
              setTableTemplateData={setTableTemplateData}
              setSelectedTableTemplateRow={setSelectedTableTemplateRow}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Button
              onClick={handleCloseDialog}
              color="info"
              variant="outlined"
              sx={{ mt: 4, borderRadius: 30 }}
            >
              Cancel
            </Button>

            <Button
              color="info"
              variant="contained"
              sx={{ mt: 4, borderRadius: 30 }}
              onClick={() => {
                if (tableTemplateData?.table) {
                  checkEmptyRow(tableTemplateData);
                } else {
                  setOpenTemplateShowInfoDialog(true);
                }
              }}
            >
              Add Template
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default ViewTemplateDialog;
