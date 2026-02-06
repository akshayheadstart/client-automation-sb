import { Box, Divider, Typography } from "@mui/material";
import React from "react";
import FormFields from "../../components/shared/ClientRegistration/FormFields";
import FormAccordion from "./FormAccordion";

const AllApplicationForm = ({ heading, formFieldsStates, preview }) => {
  return (
    <Box>
      <Box sx={{ textAlign: "center", my: 3 }}>
        <Typography variant="h6">{heading} Application Form</Typography>
      </Box>
      <FormAccordion title="Basic Details Form" index={0}>
        <FormFields
          heading="Basic Details Form"
          fieldDetails={formFieldsStates.basicDetailsFields}
          setFieldDetails={formFieldsStates.setBasicDetailsFields}
          formFieldsStates={formFieldsStates}
          preview={preview}
        />
      </FormAccordion>

      <Divider sx={{ my: 3 }} />
      <FormAccordion title="Father Details Form" index={1}>
        <FormFields
          heading="Father Details Form"
          fieldDetails={formFieldsStates.fatherDetailsFields}
          setFieldDetails={formFieldsStates.setFatherDetailsFields}
          formFieldsStates={formFieldsStates}
          preview={preview}
        />
      </FormAccordion>

      <Divider sx={{ my: 3 }} />

      <FormAccordion title="Mother Details Form" index={2}>
        <FormFields
          heading="Mother Details Form"
          fieldDetails={formFieldsStates.motherDetailsFields}
          setFieldDetails={formFieldsStates.setMotherDetailsFields}
          formFieldsStates={formFieldsStates}
          preview={preview}
        />
      </FormAccordion>

      <Divider sx={{ my: 3 }} />

      <FormAccordion title="Present Address Details Form" index={3}>
        <FormFields
          heading="Present Address Details Form"
          fieldDetails={formFieldsStates.presentAddressFields}
          setFieldDetails={formFieldsStates.setPresentAddressFields}
          formFieldsStates={formFieldsStates}
          preview={preview}
        />
      </FormAccordion>

      <Divider sx={{ my: 3 }} />
      <FormAccordion title="Permanent Address Details Form" index={4}>
        <FormFields
          heading="Permanent Address Details Form"
          fieldDetails={formFieldsStates.permanentAddressFields}
          setFieldDetails={formFieldsStates.setPermanentAddressFields}
          formFieldsStates={formFieldsStates}
          preview={preview}
        />
      </FormAccordion>
      <Divider sx={{ my: 3 }} />
      <FormAccordion title="Tenth Subject Wise Details Form" index={5}>
        <FormFields
          heading="Tenth Subject Wise Details Form"
          fieldDetails={formFieldsStates.tenthSubjectWiseDetailsFields}
          setFieldDetails={formFieldsStates.setTenthSubjectWiseDetailsFields}
          formFieldsStates={formFieldsStates}
          preview={preview}
          tenthSub={true}
        />
      </FormAccordion>
      <Divider sx={{ my: 3 }} />
      <FormAccordion title="Twelve Academic Details Form" index={6}>
        <FormFields
          heading="Twelve Academic Details Form"
          fieldDetails={formFieldsStates.twelveDetailsFields}
          setFieldDetails={formFieldsStates.setTwelveDetailsFields}
          formFieldsStates={formFieldsStates}
          preview={preview}
        />
      </FormAccordion>
      <Divider sx={{ my: 3 }} />
      <FormAccordion title="Twelve Subject Wise Details Form" index={7}>
        <FormFields
          heading="Twelve Subject Wise Details Form"
          fieldDetails={formFieldsStates.twelveSubjectWiseDetailsFields}
          setFieldDetails={formFieldsStates.setTwelveSubjectWiseDetailsFields}
          formFieldsStates={formFieldsStates}
          preview={preview}
          hideAdd={true}
        />
      </FormAccordion>
      <Divider sx={{ my: 3 }} />
      <FormAccordion title="Diploma Details Form" index={8}>
        <FormFields
          heading="Diploma Details Form"
          fieldDetails={formFieldsStates.diplomaDetailsFields}
          setFieldDetails={formFieldsStates.setDiplomaDetailsFields}
          formFieldsStates={formFieldsStates}
          preview={preview}
        />
      </FormAccordion>
      <Divider sx={{ my: 3 }} />
      <FormAccordion title="Graduation Details Form" index={8}>
        <FormFields
          heading="Graduation Details Form"
          fieldDetails={formFieldsStates.graduationDetailsFields}
          setFieldDetails={formFieldsStates.setGraduationDetailsFields}
          formFieldsStates={formFieldsStates}
          preview={preview}
        />
      </FormAccordion>
      <Divider sx={{ my: 3 }} />
      <FormAccordion title="Documents Details Form" index={8}>
        <FormFields
          documentStep={true}
          heading="Documents Details Form"
          fieldDetails={formFieldsStates.documentDetailsFields}
          setFieldDetails={formFieldsStates.setDocumentDetailsFields}
          formFieldsStates={formFieldsStates}
          preview={preview}
        />
      </FormAccordion>
      <Divider sx={{ my: 3 }} />
    </Box>
  );
};

export default AllApplicationForm;
