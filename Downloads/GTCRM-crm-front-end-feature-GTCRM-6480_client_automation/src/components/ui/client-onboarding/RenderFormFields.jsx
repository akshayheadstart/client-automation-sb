import React from "react";
import FormFields from "../../shared/ClientRegistration/FormFields";
const RenderFormFields = ({
  heading,
  fieldDetails,
  setFieldDetails,
  preview,
  handleAddFields,
  sectionIndex,
  handleAddCustomField,
  handleDeleteField,
  openAddTemplateDialog,
  setOpenAddTemplateDialog,
  handleAddTemplate,
  templateDetails,
  setTemplateDetails,
  tableTemplateData,
  setTableTemplateData,
  showTable,
  isTemplate,
  collegeId,
  clientId,
  showActions,
}) => {
  const addFieldToSection = (newField) => {
    setFieldDetails(sectionIndex, newField);
  };
  return (
    <FormFields
      heading={heading}
      fieldDetails={fieldDetails}
      setFieldDetails={addFieldToSection}
      preview={preview}
      handleAddFields={handleAddFields}
      sectionIndex={sectionIndex}
      handleAddCustomField={handleAddCustomField}
      handleDeleteField={handleDeleteField}
      openAddTemplateDialog={openAddTemplateDialog}
      setOpenAddTemplateDialog={setOpenAddTemplateDialog}
      handleAddTemplate={handleAddTemplate}
      templateDetails={templateDetails}
      setTemplateDetails={setTemplateDetails}
      tableTemplateData={tableTemplateData}
      setTableTemplateData={setTableTemplateData}
      showTable={showTable}
      isTemplate={isTemplate}
      collegeId={collegeId}
      clientId={clientId}
      showActions={showActions}
    />
  );
};

export default RenderFormFields;
