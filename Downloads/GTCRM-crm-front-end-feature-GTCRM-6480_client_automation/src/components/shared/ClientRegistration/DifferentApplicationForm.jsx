import { Box, Divider, Typography } from "@mui/material";
import React from "react";
import useHandleDifferentApplicationForm from "../../../hooks/useHandleDifferentApplicationForm";
import FormAccordion from "../../../pages/UserAccessControl/FormAccordion";
import FormFields from "./FormFields";

function DifferentApplicationForm({
  formFieldsStates,
  preview,
  heading,
  fieldDetails,
  index,
}) {
  const handleUpdateNewField = useHandleDifferentApplicationForm();

  return (
    <>
      <Box>
        <Box sx={{ textAlign: "center", my: 3 }}>
          <Typography variant="h6">{heading} Application Form</Typography>
        </Box>
        <FormAccordion title="Basic Details Form" index={0}>
          <FormFields
            heading="Basic Details Form"
            fieldDetails={fieldDetails.basic_details_form_fields}
            setFieldDetails={formFieldsStates.setDifferentCourseFormFields}
            formFieldsStates={formFieldsStates}
            preview={preview}
            handleUpdateDifferentField={(updatedField, freshData) => {
              handleUpdateNewField(
                formFieldsStates,
                updatedField,
                index,
                ["basic_details_form_fields"],
                freshData ? freshData : ""
              );
            }}
          />
        </FormAccordion>

        <Divider sx={{ my: 3 }} />
        <FormAccordion title="Father Details Form" index={1}>
          <FormFields
            heading="Father Details Form"
            fieldDetails={
              fieldDetails.parent_details_form_fields.father_details_form_fields
            }
            setFieldDetails={formFieldsStates.setDifferentCourseFormFields}
            formFieldsStates={formFieldsStates}
            preview={preview}
            handleUpdateDifferentField={(updatedField, freshData) => {
              handleUpdateNewField(
                formFieldsStates,
                updatedField,
                index,
                ["parent_details_form_fields", "father_details_form_fields"],
                freshData ? freshData : ""
              );
            }}
          />
        </FormAccordion>
        <Divider sx={{ my: 3 }} />
        <FormAccordion title="Mother Details Form" index={2}>
          <FormFields
            heading="Mother Details Form"
            fieldDetails={
              fieldDetails.parent_details_form_fields.mother_details_form_fields
            }
            setFieldDetails={formFieldsStates.setDifferentCourseFormFields}
            formFieldsStates={formFieldsStates}
            preview={preview}
            handleUpdateDifferentField={(updatedField, freshData) => {
              handleUpdateNewField(
                formFieldsStates,
                updatedField,
                index,
                ["parent_details_form_fields", "mother_details_form_fields"],
                freshData ? freshData : ""
              );
            }}
          />
        </FormAccordion>
        <Divider sx={{ my: 3 }} />
        <FormAccordion title="Guardian Details Form" index={3}>
          <FormFields
            heading="Guardian Details Form"
            fieldDetails={fieldDetails.guardian_details_fields}
            setFieldDetails={formFieldsStates.setDifferentCourseFormFields}
            formFieldsStates={formFieldsStates}
            preview={preview}
            handleUpdateDifferentField={(updatedField, freshData) => {
              handleUpdateNewField(
                formFieldsStates,
                updatedField,
                index,
                ["guardian_details_fields"],
                freshData ? freshData : ""
              );
            }}
          />
        </FormAccordion>
        <Divider sx={{ my: 3 }} />
        <FormAccordion title="Present Address Details Form" index={4}>
          <FormFields
            heading="Present Address Details Form"
            fieldDetails={
              fieldDetails.address_details_fields.address_for_correspondence
            }
            setFieldDetails={formFieldsStates.setDifferentCourseFormFields}
            formFieldsStates={formFieldsStates}
            preview={preview}
            handleUpdateDifferentField={(updatedField, freshData) => {
              handleUpdateNewField(
                formFieldsStates,
                updatedField,
                index,
                ["address_details_fields", "address_for_correspondence"],
                freshData ? freshData : ""
              );
            }}
          />
        </FormAccordion>
        <Divider sx={{ my: 3 }} />
        <FormAccordion title="Permanent Address Details Form" index={5}>
          <FormFields
            heading="Permanent Address Details Form"
            fieldDetails={fieldDetails.address_details_fields.permanent_address}
            setFieldDetails={formFieldsStates.setDifferentCourseFormFields}
            formFieldsStates={formFieldsStates}
            preview={preview}
            handleUpdateDifferentField={(updatedField, freshData) => {
              handleUpdateNewField(
                formFieldsStates,
                updatedField,
                index,
                ["address_details_fields", "permanent_address"],
                freshData ? freshData : ""
              );
            }}
          />
        </FormAccordion>
        <Divider sx={{ my: 3 }} />
        <FormAccordion title="Tenth Academic Details Form" index={6}>
          <FormFields
            heading="Tenth Academic Details Form"
            fieldDetails={
              fieldDetails.educational_details.tenth_details
                .tenth_academic_details
            }
            setFieldDetails={formFieldsStates.setDifferentCourseFormFields}
            formFieldsStates={formFieldsStates}
            preview={preview}
            handleUpdateDifferentField={(updatedField, freshData) => {
              handleUpdateNewField(
                formFieldsStates,
                updatedField,
                index,
                [
                  "educational_details",
                  "tenth_details",
                  "tenth_academic_details",
                ],
                freshData ? freshData : ""
              );
            }}
          />
        </FormAccordion>
        <Divider sx={{ my: 3 }} />
        <FormAccordion title="Tenth Subject Wise Details Form" index={7}>
          <FormFields
            heading="Tenth Subject Wise Details Form"
            fieldDetails={
              fieldDetails.educational_details.tenth_details
                .tenth_subject_wise_details
            }
            setFieldDetails={formFieldsStates.setDifferentCourseFormFields}
            formFieldsStates={formFieldsStates}
            preview={preview}
            tenthSub={true}
            handleUpdateDifferentField={(updatedField, freshData) => {
              handleUpdateNewField(
                formFieldsStates,
                updatedField,
                index,
                [
                  "educational_details",
                  "tenth_details",
                  "tenth_subject_wise_details",
                ],
                freshData ? freshData : ""
              );
            }}
          />
        </FormAccordion>
        <Divider sx={{ my: 3 }} />
        <FormAccordion title="Twelve Academic Details Form" index={8}>
          <FormFields
            heading="Twelve Academic Details Form"
            fieldDetails={
              fieldDetails.educational_details.twelve_details
                .twelve_academic_details
            }
            setFieldDetails={formFieldsStates.setDifferentCourseFormFields}
            formFieldsStates={formFieldsStates}
            preview={preview}
            handleUpdateDifferentField={(updatedField, freshData) => {
              handleUpdateNewField(
                formFieldsStates,
                updatedField,
                index,
                [
                  "educational_details",
                  "twelve_details",
                  "twelve_academic_details",
                ],
                freshData ? freshData : ""
              );
            }}
          />
        </FormAccordion>
        <Divider sx={{ my: 3 }} />
        <FormAccordion title="Twelve Subject Wise Details Form" index={9}>
          <FormFields
            heading="Twelve Subject Wise Details Form"
            hideAdd={true}
            preview={true}
            fieldDetails={
              fieldDetails.educational_details.twelve_details
                .twelve_subject_wise_details
            }
            setFieldDetails={formFieldsStates.setDifferentCourseFormFields}
            formFieldsStates={formFieldsStates}
            handleUpdateDifferentField={(updatedField, freshData) => {
              handleUpdateNewField(
                formFieldsStates,
                updatedField,
                index,
                [
                  "educational_details",
                  "twelve_details",
                  "tenth_subject_wise_details",
                ],
                freshData ? freshData : ""
              );
            }}
          />
        </FormAccordion>

        <Divider sx={{ my: 3 }} />
        <FormAccordion title="Diploma Details Form" index={10}>
          <FormFields
            heading="Diploma Details Form"
            fieldDetails={
              fieldDetails.educational_details.diploma_academic_details
            }
            setFieldDetails={formFieldsStates.setDifferentCourseFormFields}
            formFieldsStates={formFieldsStates}
            preview={preview}
            handleUpdateDifferentField={(updatedField, freshData) => {
              handleUpdateNewField(
                formFieldsStates,
                updatedField,
                index,
                ["educational_details", "diploma_academic_details"],
                freshData ? freshData : ""
              );
            }}
          />
        </FormAccordion>
        <Divider sx={{ my: 3 }} />
        <FormAccordion title="Graduation Details Form" index={10}>
          <FormFields
            heading="Graduation Details Form"
            fieldDetails={fieldDetails.educational_details.graduation_details}
            setFieldDetails={formFieldsStates.setDifferentCourseFormFields}
            formFieldsStates={formFieldsStates}
            preview={preview}
            handleUpdateDifferentField={(updatedField, freshData) => {
              handleUpdateNewField(
                formFieldsStates,
                updatedField,
                index,
                ["educational_details", "graduation_details"],
                freshData ? freshData : ""
              );
            }}
          />
        </FormAccordion>
        <Divider sx={{ my: 3 }} />
        <FormAccordion title="Document Details Form" index={0}>
          <FormFields
            documentStep={true}
            heading="Document Details Form"
            fieldDetails={fieldDetails.document_details}
            setFieldDetails={formFieldsStates.setDifferentCourseFormFields}
            formFieldsStates={formFieldsStates}
            preview={preview}
            handleUpdateDifferentField={(updatedField, freshData) => {
              handleUpdateNewField(
                formFieldsStates,
                updatedField,
                index,
                ["document_details"],
                freshData ? freshData : ""
              );
            }}
          />
        </FormAccordion>

        <Divider sx={{ my: 3 }} />
      </Box>
    </>
  );
}

export default DifferentApplicationForm;
