import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import ViewTemplateDialog from "./ViewTemplateDialog";
import useToasterHook from "../../../hooks/useToasterHook";
import CloseIcon from "@mui/icons-material/Close";
import VisibleIcon from "@rsuite/icons/Visible";
import TemplateShowInfoDialog from "./TemplateShowInfoDialog";
import { useGetDefaultTemplatesQuery } from "../../../Redux/Slices/clientOnboardingSlice";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";

const templates = [
  {
    template_name: "Parent Details",
    template_type: "Predefined",
    template_details: {
      section_title: "Parent/Guardians/Spouse Details",
      is_template: true,
      can_repeat_template: true,
      repeat_count: 3,
      fields: [
        {
          field_name: "Relationship With Student",
          field_type: "select",
          is_mandatory: true,
          editable: false,
          can_remove: false,
          value: "",
          error: "",
          key_name: "relationship_with_student",
          options: ["Father", "Mother", "Guardian", "Spouse", "Other"],
          dependent_fields: {
            logical_fields: {
              Father: {
                fields: [
                  {
                    field_name: "Father Name",
                    field_type: "text",
                    is_mandatory: true,
                    editable: false,
                    can_remove: false,
                    value: "",
                    error: "",
                    key_name: "father_name",
                  },
                  {
                    field_name: "Father Mobile No.",
                    field_type: "number",
                    is_mandatory: false,
                    editable: false,
                    can_remove: false,
                    value: "",
                    error: "",
                    key_name: "father_mobile_no",
                  },
                  {
                    field_name: "Father Email",
                    field_type: "email",
                    is_mandatory: false,
                    editable: false,
                    can_remove: false,
                    value: "",
                    error: "",
                    key_name: "father_email",
                  },
                  {
                    field_name: "Father Occupation",
                    field_type: "text",
                    is_mandatory: false,
                    editable: false,
                    can_remove: false,
                    value: "",
                    error: "",
                    key_name: "father_occupation",
                  },
                ],
              },
              Mother: {
                fields: [
                  {
                    field_name: "Mother Name",
                    field_type: "text",
                    is_mandatory: true,
                    editable: false,
                    can_remove: false,
                    value: "",
                    error: "",
                    key_name: "mother_name",
                  },
                  {
                    field_name: "Mother Mobile No.",
                    field_type: "number",
                    is_mandatory: false,
                    editable: false,
                    can_remove: false,
                    value: "",
                    error: "",
                    key_name: "mother_mobile_no",
                  },
                  {
                    field_name: "Mother Email",
                    field_type: "email",
                    is_mandatory: false,
                    editable: false,
                    can_remove: false,
                    value: "",
                    error: "",
                    key_name: "mother_email",
                  },
                  {
                    field_name: "Mother Occupation",
                    field_type: "text",
                    is_mandatory: false,
                    editable: false,
                    can_remove: false,
                    value: "",
                    error: "",
                    key_name: "mother_occupation",
                  },
                ],
              },
              Guardian: {
                fields: [
                  {
                    field_name: "Guardian Name",
                    field_type: "text",
                    is_mandatory: true,
                    editable: false,
                    can_remove: false,
                    value: "",
                    error: "",
                    key_name: "guardian_name",
                  },
                  {
                    field_name: "Guardian Mobile No.",
                    field_type: "number",
                    is_mandatory: false,
                    editable: false,
                    can_remove: false,
                    value: "",
                    error: "",
                    key_name: "guardian_mobile_no",
                  },
                  {
                    field_name: "Guardian Email",
                    field_type: "email",
                    is_mandatory: false,
                    editable: false,
                    can_remove: false,
                    value: "",
                    error: "",
                    key_name: "guardian_email",
                  },
                  {
                    field_name: "Guardian Occupation",
                    field_type: "text",
                    is_mandatory: false,
                    editable: false,
                    can_remove: false,
                    value: "",
                    error: "",
                    key_name: "guardian_occupation",
                  },
                ],
              },
              Spouse: {
                fields: [
                  {
                    field_name: "Spouse Name",
                    field_type: "text",
                    is_mandatory: true,
                    editable: false,
                    can_remove: false,
                    value: "",
                    error: "",
                    key_name: "spouse_name",
                  },
                  {
                    field_name: "Spouse Mobile No.",
                    field_type: "number",
                    is_mandatory: false,
                    editable: false,
                    can_remove: false,
                    value: "",
                    error: "",
                    key_name: "spouse_mobile_no",
                  },
                  {
                    field_name: "Spouse Email",
                    field_type: "email",
                    is_mandatory: false,
                    editable: false,
                    can_remove: false,
                    value: "",
                    error: "",
                    key_name: "spouse_email",
                  },
                  {
                    field_name: "Spouse Occupation",
                    field_type: "text",
                    is_mandatory: false,
                    editable: false,
                    can_remove: false,
                    value: "",
                    error: "",
                    key_name: "spouse_occupation",
                  },
                ],
              },
              Other: {
                fields: [
                  {
                    field_name: "Other Guardian Name",
                    field_type: "text",
                    is_mandatory: true,
                    editable: false,
                    can_remove: false,
                    value: "",
                    error: "",
                    key_name: "other_guardian_name",
                  },
                  {
                    field_name: "Other Guardian Mobile No.",
                    field_type: "number",
                    is_mandatory: false,
                    editable: false,
                    can_remove: false,
                    value: "",
                    error: "",
                    key_name: "other_guardian_mobile_no",
                  },
                  {
                    field_name: "Other Guardian Email",
                    field_type: "email",
                    is_mandatory: false,
                    editable: false,
                    can_remove: false,
                    value: "",
                    error: "",
                    key_name: "other_guardian_email",
                  },
                  {
                    field_name: "Other Guardian Occupation",
                    field_type: "text",
                    is_mandatory: false,
                    editable: false,
                    can_remove: false,
                    value: "",
                    error: "",
                    key_name: "other_guardian_occupation",
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
  {
    template_name: "12th subject wise details",
    template_type: "Predefined",
    template_details: {
      section_title: "",
      is_template: true,
      table: {
        headers: [
          {
            header_name: "Subject Name",
            is_mandatory: true,
            editable: false,
            isNew: false,
          },
          {
            header_name: "Maximum",
            is_mandatory: true,
            editable: false,
            isNew: false,
          },
          {
            header_name: "Obtained",
            is_mandatory: true,
            editable: false,
            isNew: false,
          },
        ],
        rows: [
          {
            field_name: "Subject Name",
            field_type: "text",
            is_mandatory: false,
            editable: false,
            can_remove: false,
            value: "",
            error: "",
            key_name: "subject_name",
            isNew: false,
          },
          {
            field_name: "Maximum",
            field_type: "text",
            is_mandatory: false,
            editable: false,
            can_remove: false,
            value: "",
            error: "",
            key_name: "maximum",
            isNew: false,
          },
          {
            field_name: "Obtained",
            field_type: "text",
            is_mandatory: false,
            editable: false,
            can_remove: false,
            value: "",
            error: "",
            key_name: "obtained",
            isNew: false,
          },
        ],
        can_repeat_template: true,
        repeat_count: 12,
        initial_row_count: 6,
        mandatory_row: 2,
        fields: [
          {
            field_name: "Total Marks Scored",
            field_type: "text",
            is_mandatory: false,
            editable: false,
            can_remove: false,
            value: "",
            error: "",
            key_name: "total_marks_scored",
          },
          {
            field_name: "Total Maximum Marks",
            field_type: "text",
            is_mandatory: false,
            editable: false,
            can_remove: false,
            value: "",
            error: "",
            key_name: "total_maximum_marks",
          },
          {
            field_name: "Aggregate marks %",
            field_type: "text",
            is_mandatory: false,
            editable: false,
            can_remove: false,
            value: "",
            error: "",
            key_name: "aggregate_marks_%",
          },
        ],
      },
    },
  },
  {
    template_name: "Semester/Yearly details",
    template_type: "Predefined",
    template_details: {
      section_title: "",
      is_template: true,
      table: {
        result_mode_fields: [
          {
            field_name: "Result Mode",
            field_type: "radio",
            is_mandatory: true,
            editable: false,
            can_remove: false,
            value: true,
            error: "",
            key_name: "result_mode",
            options: [
              { label: "Semester", value: true },
              { label: "Yearly", value: false },
            ],
            isNew: false,
          },
        ],
        headers: [
          {
            header_name: "Semester Number",
            is_mandatory: true,
            editable: true,
            isNew: false,
          },
          {
            header_name: "Completed/Pursuing",
            is_mandatory: true,
            editable: false,
            isNew: false,
          },
          {
            header_name: "Maximum",
            is_mandatory: true,
            editable: false,
            isNew: false,
          },
          {
            header_name: "Obtained",
            is_mandatory: true,
            editable: false,
            isNew: false,
          },
        ],
        rows: [
          {
            field_name: "Semester Number",
            field_type: "text",
            is_mandatory: false,
            editable: false,
            can_remove: false,
            value: "",
            error: "",
            key_name: "semester_number",
            isNew: false,
          },
          {
            field_name: "Completed/Pursuing",
            field_type: "select",
            is_mandatory: false,
            editable: false,
            can_remove: false,
            value: "",
            error: "",
            key_name: "completed-or_pursuing",
            isNew: false,
            options: ["Completed", "Pursuing"],
          },
          {
            field_name: "Maximum",
            field_type: "text",
            is_mandatory: false,
            editable: false,
            can_remove: false,
            value: "",
            error: "",
            key_name: "maximum",
            isNew: false,
          },
          {
            field_name: "Obtained",
            field_type: "text",
            is_mandatory: false,
            editable: false,
            can_remove: false,
            value: "",
            error: "",
            key_name: "obtained",
            isNew: false,
          },
        ],
        can_repeat_template: true,
        repeat_count: 12,
        initial_row_count: 6,
        mandatory_row: 4,
        fields: [
          {
            field_name: "Total Marks Scored",
            field_type: "text",
            is_mandatory: false,
            editable: false,
            can_remove: false,
            value: "",
            error: "",
            key_name: "total_marks_scored",
          },
          {
            field_name: "Total Maximum Marks",
            field_type: "text",
            is_mandatory: false,
            editable: false,
            can_remove: false,
            value: "",
            error: "",
            key_name: "total_maximum_marks",
          },
          {
            field_name: "Aggregate marks %",
            field_type: "text",
            is_mandatory: false,
            editable: false,
            can_remove: false,
            value: "",
            error: "",
            key_name: "aggregate_marks_%",
          },
        ],
      },
    },
  },
  {
    template_name: "Entrance Exam Details",
    template_type: "Predefined",
    template_details: {
      section_title: "Entrance Exam Details",
      is_template: true,
      can_repeat_template: false,
      repeat_count: 0,
      fields: [
        {
          field_name: "Please indicate the status of your entrance test",
          field_type: "radio",
          is_mandatory: true,
          editable: true,
          can_remove: true,
          value: "",
          error: "",
          key_name: "please_indicate_the_status_of_your_entrance_test",
          options: ["Appeared", "Not Appeared"],
          dependent_fields: {
            logical_fields: {
              Appeared: [
                {
                  field_name: "Name of Exam",
                  field_type: "select",
                  is_mandatory: true,
                  editable: true,
                  can_remove: true,
                  value: "",
                  error: "",
                  key_name: "name_of_exam",
                  options: ["JEE", "GMAT"],
                },
                {
                  field_name: "Roll No",
                  field_type: "text",
                  is_mandatory: false,
                  editable: true,
                  can_remove: true,
                  value: "",
                  error: "",
                  key_name: "roll_no",
                },
                {
                  field_name: "Year of Appearing",
                  field_type: "date",
                  is_mandatory: true,
                  editable: true,
                  can_remove: true,
                  value: "",
                  error: "",
                  key_name: "year_of_appearing",
                },
                {
                  field_name: "Percentile",
                  field_type: "text",
                  is_mandatory: false,
                  editable: true,
                  can_remove: true,
                  value: "",
                  error: "",
                  key_name: "percentile",
                },
                {
                  field_name: "Rank",
                  field_type: "text",
                  is_mandatory: false,
                  editable: true,
                  can_remove: true,
                  value: "",
                  error: "",
                  key_name: "rank",
                },
                {
                  field_name: "Total Marks Scored",
                  field_type: "text",
                  is_mandatory: false,
                  editable: true,
                  can_remove: true,
                  value: "",
                  error: "",
                  key_name: "total_marks_scored",
                },
                {
                  field_name: "Total Maximum Marks",
                  field_type: "text",
                  is_mandatory: false,
                  editable: true,
                  can_remove: true,
                  value: "",
                  error: "",
                  key_name: "total_maximum_marks",
                },
                {
                  field_name: "Aggregate Marks %",
                  field_type: "text",
                  is_mandatory: false,
                  editable: true,
                  can_remove: true,
                  value: "",
                  error: "",
                  key_name: "aggregate_marks_%",
                },
                {
                  field_name:
                    "Have you appeared for any other entrance exam also?",
                  field_type: "radio",
                  is_mandatory: true,
                  editable: true,
                  can_remove: true,
                  value: "",
                  error: "",
                  key_name:
                    "have_you_appeared_for_any_other_entrance_exam_also?",
                  options: ["Yes", "No"],
                  dependent_fields: {
                    logical_fields: {
                      Yes: {
                        title: "",
                        fields: [
                          {
                            field_name: "Name of Exam",
                            field_type: "select",
                            is_mandatory: true,
                            editable: true,
                            can_remove: true,
                            value: "",
                            error: "",
                            key_name: "name_of_exam",
                            options: ["JEE", "GMAT"],
                          },
                          {
                            field_name: "Roll No",
                            field_type: "text",
                            is_mandatory: false,
                            editable: true,
                            can_remove: true,
                            value: "",
                            error: "",
                            key_name: "roll_no",
                          },
                          {
                            field_name: "Year of Appearing",
                            field_type: "date",
                            is_mandatory: true,
                            editable: true,
                            can_remove: true,
                            value: "",
                            error: "",
                            key_name: "year_of_appearing",
                          },
                          {
                            field_name: "Percentile",
                            field_type: "text",
                            is_mandatory: false,
                            editable: true,
                            can_remove: true,
                            value: "",
                            error: "",
                            key_name: "percentile",
                          },
                          {
                            field_name: "Rank",
                            field_type: "text",
                            is_mandatory: false,
                            editable: true,
                            can_remove: true,
                            value: "",
                            error: "",
                            key_name: "rank",
                          },
                          {
                            field_name: "Total Marks Scored",
                            field_type: "text",
                            is_mandatory: false,
                            editable: true,
                            can_remove: true,
                            value: "",
                            error: "",
                            key_name: "total_marks_scored",
                          },
                          {
                            field_name: "Total Maximum Marks",
                            field_type: "text",
                            is_mandatory: false,
                            editable: true,
                            can_remove: true,
                            value: "",
                            error: "",
                            key_name: "total_maximum_marks",
                          },
                          {
                            field_name: "Aggregate Marks %",
                            field_type: "text",
                            is_mandatory: false,
                            editable: true,
                            can_remove: true,
                            value: "",
                            error: "",
                            key_name: "aggregate_marks_%",
                          },
                          {
                            field_name:
                              "Have you appeared for any other entrance exam also?",
                            field_type: "radio",
                            is_mandatory: true,
                            editable: true,
                            can_remove: true,
                            value: "",
                            error: "",
                            key_name:
                              "have_you_appeared_for_any_other_entrance_exam_also?",
                            options: ["Yes", "No"],
                            dependent_fields: {
                              logical_fields: {
                                Yes: {
                                  title: "",
                                  fields: [
                                    {
                                      field_name: "Name of Exam",
                                      field_type: "select",
                                      is_mandatory: true,
                                      editable: true,
                                      can_remove: true,
                                      value: "",
                                      error: "",
                                      key_name: "name_of_exam",
                                      options: ["JEE", "GMAT"],
                                    },
                                    {
                                      field_name: "Roll No",
                                      field_type: "text",
                                      is_mandatory: false,
                                      editable: true,
                                      can_remove: true,
                                      value: "",
                                      error: "",
                                      key_name: "roll_no",
                                    },
                                    {
                                      field_name: "Year of Appearing",
                                      field_type: "date",
                                      is_mandatory: true,
                                      editable: true,
                                      can_remove: true,
                                      value: "",
                                      error: "",
                                      key_name: "year_of_appearing",
                                    },
                                    {
                                      field_name: "Percentile",
                                      field_type: "text",
                                      is_mandatory: false,
                                      editable: true,
                                      can_remove: true,
                                      value: "",
                                      error: "",
                                      key_name: "percentile",
                                    },
                                    {
                                      field_name: "Rank",
                                      field_type: "text",
                                      is_mandatory: false,
                                      editable: true,
                                      can_remove: true,
                                      value: "",
                                      error: "",
                                      key_name: "rank",
                                    },
                                    {
                                      field_name: "Total Marks Scored",
                                      field_type: "text",
                                      is_mandatory: false,
                                      editable: true,
                                      can_remove: true,
                                      value: "",
                                      error: "",
                                      key_name: "total_marks_scored",
                                    },
                                    {
                                      field_name: "Total Maximum Marks",
                                      field_type: "text",
                                      is_mandatory: false,
                                      editable: true,
                                      can_remove: true,
                                      value: "",
                                      error: "",
                                      key_name: "total_maximum_marks",
                                    },
                                    {
                                      field_name: "Aggregate Marks %",
                                      field_type: "text",
                                      is_mandatory: false,
                                      editable: true,
                                      can_remove: true,
                                      value: "",
                                      error: "",
                                      key_name: "aggregate_marks_%",
                                    },
                                  ],
                                },
                                No: null,
                              },
                            },
                          },
                        ],
                      },
                      No: null,
                    },
                  },
                },
              ],
              "Not Appeared": null,
            },
          },
        },
      ],
    },
  },
  {
    template_name: "Work Experience",
    template_type: "Predefined",
    template_details: {
      section_title: "Work Experience",
      is_template: true,
      can_repeat_template: true,
      repeat_count: 20,
      fields: [
        {
          field_name: "Do you have work experience?",
          field_type: "radio",
          is_mandatory: true,
          editable: true,
          can_remove: true,
          value: "",
          error: "",
          key_name: "do_you_have_work_experience",
          options: ["Yes", "No"],
          dependent_fields: {
            logical_fields: {
              Yes: [
                {
                  field_name: "Employment Type",
                  field_type: "select",
                  is_mandatory: true,
                  editable: true,
                  can_remove: true,
                  value: "",
                  error: "",
                  key_name: "employment_type",
                  options: [
                    "Organized Sector",
                    "Un-organized sector",
                    "Self Employed",
                  ],
                },
                {
                  field_name: "Organization",
                  field_type: "text",
                  is_mandatory: true,
                  editable: true,
                  can_remove: true,
                  value: "",
                  error: "",
                  key_name: "organization",
                },
                {
                  field_name: "Position",
                  field_type: "text",
                  is_mandatory: true,
                  editable: true,
                  can_remove: true,
                  value: "",
                  error: "",
                  key_name: "position",
                },
                {
                  field_name: "From",
                  field_type: "date",
                  is_mandatory: false,
                  editable: true,
                  can_remove: true,
                  value: "",
                  error: "",
                  key_name: "from",
                },
                {
                  field_name: "To",
                  field_type: "date",
                  is_mandatory: false,
                  editable: true,
                  can_remove: true,
                  value: "",
                  error: "",
                  key_name: "to",
                },
                {
                  field_name: "Is this your current organization?",
                  field_type: "checkbox",
                  is_mandatory: false,
                  editable: true,
                  can_remove: true,
                  value: "",
                  error: "",
                  key_name: "is_this_your_current_organization",
                },
              ],
              No: null,
            },
          },
        },
      ],
    },
  },
];

const AddTemplateDialog = ({
  open,
  handleCloseDialog,
  title,
  subTitle,
  sectionIndex,
  handleAddTemplate,
  templateDetails,
  setTemplateDetails,
  tableTemplateData,
  setTableTemplateData,
}) => {
  const pushNotification = useToasterHook();
  const [selectedRows, setSelectedRows] = useState([]);
  const [openViewTemplateDialog, setOpenViewTemplateDialog] = useState(false);
  const [selectedTableTemplateRow, setSelectedTableTemplateRow] =
    useState(null);
  const [openTemplateShowInfoDialog, setOpenTemplateShowInfoDialog] =
    useState(false);

  const [defaultTemplates, setDefaultTemplates] = useState([]);

  const [
    defaultTemplatesInternalServerError,
    setDefaultTemplatesInternalServerError,
  ] = useState(false);

  const [
    somethingWentWrongInDefaultTemplates,
    setSomethingWentWrongInDefaultTemplates,
  ] = useState(false);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const handleCloseViewTemplateDialog = () => {
    setOpenViewTemplateDialog(false);
  };

  const handleCloseTemplateShowInfoDialog = () => {
    setOpenTemplateShowInfoDialog(false);
  };

  const { data, isSuccess, isFetching, error, isError } =
    useGetDefaultTemplatesQuery();

  useEffect(() => {
    try {
      if (isSuccess) {
        const expectedData = data;
        if (Array.isArray(expectedData)) {
          setDefaultTemplates(expectedData);
        } else {
          throw new Error("get default templates API response has changed");
        }
      }
      if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setDefaultTemplatesInternalServerError,
            "",
            5000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInDefaultTemplates,
        "",
        5000
      );
    }
  }, [error, isError, isSuccess, data]);

  const handleAddFieldsInTemplate = (_, selectedRows) => {
    if (templateDetails?.table?.headers) {
      setTableTemplateData((prevTableData) => {
        const updatedRows = prevTableData.table.rows.map((row, index) =>
          index === selectedTableTemplateRow ? selectedRows?.[0] : row
        );

        return {
          ...prevTableData,
          table: {
            ...prevTableData.table,
            rows: updatedRows,
          },
        };
      });

      setTemplateDetails((prevDetails) => {
        return {
          ...prevDetails,
          table: {
            ...prevDetails.table,
            rows: selectedRows,
          },
        };
      });
    } else {
      setTemplateDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;

        return {
          ...prevDetails,
          ...(prevDetails.fields && {
            fields: selectedRows,
          }),
          ...(prevDetails.table && {
            table: {
              ...prevDetails.table,
              rows: [...prevDetails.table.rows, ...selectedRows],
            },
          }),
        };
      });
    }
  };

  const addTemplateShowInfo = (updatedValues) => {
    if (templateDetails?.table?.headers) {
      setTableTemplateData((prevTableData) => {
        const updatedTableTemplateData = {
          ...prevTableData,
          table: {
            ...prevTableData.table,
            ...updatedValues,
          },
        };

        handleAddTemplate(updatedTableTemplateData);
        return updatedTableTemplateData;
      });
    } else {
      setTemplateDetails((prevTemplateDetails) => {
        const updatedTemplateDetails = {
          ...prevTemplateDetails,
          ...updatedValues,
        };

        handleAddTemplate(updatedTemplateDetails);
        return updatedTemplateDetails;
      });
    }
  };

  const handleAddCustomField = (updatedField, editingIndex, sectionIndex) => {
    setTemplateDetails((prevDetails) => {
      if (!prevDetails) return prevDetails; // Prevent errors if template_details is not set

      // Update fields if they exist
      let updatedFields = prevDetails.fields ? [...prevDetails.fields] : [];
      let updatedRows = prevDetails.table ? [...prevDetails.table.rows] : [];

      if (prevDetails.fields) {
        const fieldIndex = updatedFields.findIndex(
          (field) => field.key_name === updatedField.key_name
        );

        if (fieldIndex !== -1) {
          // Update existing field
          updatedFields[fieldIndex] = updatedField;
        } else {
          // Add new field
          updatedFields.push(updatedField);
        }
      }

      if (prevDetails.table) {
        const rowIndex = updatedRows.findIndex(
          (row) => row.key_name === updatedField.key_name
        );

        if (rowIndex !== -1) {
          // Update existing row
          updatedRows[rowIndex] = updatedField;
        } else {
          // Add new row
          updatedRows.push(updatedField);
        }
      }

      return {
        ...prevDetails,
        ...(prevDetails.fields && { fields: updatedFields }),
        ...(prevDetails.table && {
          table: { ...prevDetails.table, rows: updatedRows },
        }),
      };
    });
  };

  const handleDeleteField = (deleteIndex) => {
    setTemplateDetails((prevDetails) => {
      if (!prevDetails) return prevDetails; // Prevent errors if template_details is not set

      let updatedFields = prevDetails.fields ? [...prevDetails.fields] : [];
      let updatedRows = prevDetails.table ? [...prevDetails.table.rows] : [];

      if (prevDetails.fields) {
        updatedFields = updatedFields.filter(
          (_, index) => index !== deleteIndex
        );
      }

      if (prevDetails.table) {
        updatedRows = updatedRows.filter((_, index) => index !== deleteIndex);
      }

      return {
        ...prevDetails,
        ...(prevDetails.fields && { fields: updatedFields }),
        ...(prevDetails.table && {
          table: { ...prevDetails.table, rows: updatedRows },
        }),
      };
    });
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCloseDialog} fullWidth>
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

          <IconButton
            onClick={() => {
              handleCloseDialog();
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ pb: 8 }}>
          <DialogContentText>{subTitle}</DialogContentText>

          {defaultTemplatesInternalServerError ||
          somethingWentWrongInDefaultTemplates ? (
            <Box className="loading-animation-for-search">
              {defaultTemplatesInternalServerError && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {somethingWentWrongInDefaultTemplates && (
                <ErrorFallback
                  error={apiResponseChangeMessage}
                  resetErrorBoundary={() => window.location.reload()}
                />
              )}
            </Box>
          ) : (
            <>
              {isFetching ? (
                <Box className="loading-animation">
                  <LeefLottieAnimationLoader
                    height={120}
                    width={120}
                  ></LeefLottieAnimationLoader>
                </Box>
              ) : (
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell>Template Name</TableCell>
                        <TableCell>Template Type</TableCell>
                        <TableCell align="center">Action</TableCell>
                        <TableCell align="center">Add</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {defaultTemplates?.map((template, index) => (
                        <TableRow key={template.template_name}>
                          <TableCell>{template.template_name}</TableCell>
                          <TableCell>{template.template_type}</TableCell>
                          <TableCell
                            onClick={() => {
                              setOpenViewTemplateDialog(true);
                              setTemplateDetails(template.template_details);
                              setTableTemplateData(template.template_details);
                            }}
                            align="center"
                          >
                            <VisibleIcon
                              style={{ color: "#3498ff", cursor: "pointer" }}
                            />
                          </TableCell>

                          <TableCell>
                            <Button
                              color="info"
                              variant="outlined"
                              fullWidth
                              type="submit"
                              onClick={() => {
                                setTemplateDetails(template.template_details);
                                setTableTemplateData(template.template_details);
                                setOpenTemplateShowInfoDialog(true);
                              }}
                            >
                              Add
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {openViewTemplateDialog && (
        <ViewTemplateDialog
          open={openViewTemplateDialog}
          handleCloseDialog={handleCloseViewTemplateDialog}
          title={"View Template"}
          subTitle={""}
          templateDetails={templateDetails}
          handleAddFieldsInTemplate={handleAddFieldsInTemplate}
          sectionIndex={sectionIndex}
          handleAddCustomField={handleAddCustomField}
          handleDeleteField={handleDeleteField}
          tableTemplateData={tableTemplateData}
          setTableTemplateData={setTableTemplateData}
          setSelectedTableTemplateRow={setSelectedTableTemplateRow}
          setOpenTemplateShowInfoDialog={setOpenTemplateShowInfoDialog}
        />
      )}

      {openTemplateShowInfoDialog && (
        <TemplateShowInfoDialog
          openTemplateShowInfoDialog={openTemplateShowInfoDialog}
          handleCloseTemplateShowInfoDialog={handleCloseTemplateShowInfoDialog}
          title="Template Show Information"
          templateDetails={templateDetails}
          addTemplateShowInfo={addTemplateShowInfo}
          handleCloseAddTemplateDialog={handleCloseDialog}
        />
      )}
    </React.Fragment>
  );
};

export default AddTemplateDialog;
