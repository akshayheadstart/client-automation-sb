import React, { useEffect, useState } from "react";
import { useGetClientDefaultFormQuery } from "../../../Redux/Slices/clientOnboardingSlice";
import useToasterHook from "../../../hooks/useToasterHook";
import { useNavigate } from "react-router-dom";
import RegistrationForm from "./RegistrationForm";
import DynamicTabs from "./DynamicTabs";
import "../../../styles/clientOnboardingStyles.css";
import { useSelector } from "react-redux";
import ApplicationFormWithoutParentTab from "./ApplicationFormWithoutParentTab";
import { Box } from "@mui/material";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";

const ClientDefaultForm = ({
  currentSectionIndex,
  setCurrentSectionIndex,
  collegeId,
  hideBackBtn,
  apiCallingStepValue,
  additionalPreferenceFields,
  clientId,
  approverId,
  from,
}) => {
  const pushNotification = useToasterHook();
  const navigate = useNavigate();

  const userId = useSelector((state) => state.authentication.token?.user_id);

  const [regFormFields, setRegFormFields] = useState([]);

  const [skipGetDefaultFormAPI, setSkipGetDefaultFormAPI] = useState(false);
  const [applicationFormFields, setApplicationFormFields] = useState([]);

  const params = new URLSearchParams();
  if (clientId)
    params.append("client_id", clientId ? clientId : !collegeId ? userId : "");
  if (collegeId) params.append("college_id", collegeId);

  const {
    data,
    isSuccess,
    isFetching: isFetchingDefaultForm,
    error,
    isError,
  } = useGetClientDefaultFormQuery(
    {
      url:
        from === "requestView"
          ? `/approval/get_request_data/${approverId}`
          : `/master/retrieve_all_stages?${params.toString()}`,
    },
    {
      skip: skipGetDefaultFormAPI,
    }
  );

  useEffect(() => {
    try {
      if (isSuccess) {
        const expectedData = data;
        if (expectedData) {
          if (additionalPreferenceFields?.length > 0) {
            // Dynamically build section fields

            const preferenceFields =
              additionalPreferenceFields?.length > 0 &&
              additionalPreferenceFields?.map((_, index) => ({
                field_name: `Preference ${index + 1}`,
                field_type: "select",
                is_mandatory: false,
                editable: false,
                can_remove: false,
                value: "",
                error: "",
                key_name: `preference${index + 1}`,
                is_locked: true,
                is_readonly: true,
                options: [],
                addOptionsFrom: "API",
                apiFunction: "fetchSpecialization",
                is_custom: true,
              }));

            const updatedSection = {
              section_title: "Program Details",
              section_subtitle: "",
              is_locked: true,
              is_custom: false,
              is_template: true,
              fields:
                additionalPreferenceFields?.length > 0
                  ? [
                      {
                        field_name: "Main Specialization",
                        field_type: "select",
                        is_mandatory: true,
                        editable: false,
                        can_remove: false,
                        value: "",
                        error: "",
                        key_name: "specialization",
                        is_locked: true,
                        is_readonly: true,
                        options: [],
                        addOptionsFrom: "API",
                        apiFunction: "fetchSpecialization",
                      },
                      ...preferenceFields,
                    ]
                  : [
                      {
                        field_name: "Specialization",
                        field_type: "select",
                        is_mandatory: true,
                        editable: false,
                        can_remove: false,
                        value: "",
                        error: "",
                        key_name: "specialization",
                        is_locked: true,
                        is_readonly: true,
                        options: [],
                        addOptionsFrom: "API",
                        apiFunction: "fetchSpecialization",
                      },
                    ],
            };

            const modifiedFormFields = data?.application_form?.map(
              (step, index) => {
                if (index === 0) {
                  return {
                    ...step,
                    sections: [updatedSection],
                  };
                }
                return step;
              }
            );

            setApplicationFormFields(modifiedFormFields);
          } else {
            setApplicationFormFields(data?.application_form);
          }

          if (from === "requestView") {
            setApplicationFormFields(data?.payload?.application_form);
            setRegFormFields(data?.payload?.student_registration_form_fields);
            setParentTabsOfApplicationForm(
              (data?.payload?.category && [data?.payload?.category]) ||
                (data?.payload?.course_name && [data?.payload?.course_name]) ||
                []
            );
          } else {
            setRegFormFields(data?.student_registration_form_fields);
          }
        } else {
          throw new Error(
            "get client default form details API response has changed"
          );
        }
      }
      if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          navigate("/page500");
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }, [error, isError, isSuccess, data]);

  useEffect(() => {
    if (currentSectionIndex === apiCallingStepValue) {
      setSkipGetDefaultFormAPI(false);
    }
  }, [currentSectionIndex]);
  const handleDeleteField = (fieldIndex) => {
    setRegFormFields((prevFields) =>
      prevFields.filter((_, index) => index !== fieldIndex)
    );
  };

  const [parentTabsOfApplicationForm, setParentTabsOfApplicationForm] =
    useState(() => {
      const storedData = localStorage.getItem(
        `${userId}createCollegeDifferentForm`
      );

      const addedCourses = JSON.parse(
        localStorage.getItem(`${userId}createCollegeAddedCourses`)
      );

      if (storedData === "category_wise") {
        return ["UG", "PG", "PhD"];
      } else if (storedData === "course_wise") {
        const courseNames = addedCourses?.map((course) => course?.course_name);
        return courseNames;
      }
    });

  return (
    <>
      {isFetchingDefaultForm ? (
        <Box className="loading-animation">
          <LeefLottieAnimationLoader
            height={120}
            width={120}
          ></LeefLottieAnimationLoader>
        </Box>
      ) : (
        <>
          {from === "requestView" ? (
            regFormFields?.length > 0 && (
              <RegistrationForm
                regFormFields={regFormFields}
                setRegFormFields={setRegFormFields}
                collegeId={collegeId}
                isFetchingDefaultForm={isFetchingDefaultForm}
                clientId={clientId}
                handleDeleteField={handleDeleteField}
                approverId={approverId}
              />
            )
          ) : (
            <RegistrationForm
              regFormFields={regFormFields}
              setRegFormFields={setRegFormFields}
              collegeId={collegeId}
              isFetchingDefaultForm={isFetchingDefaultForm}
              clientId={clientId}
              handleDeleteField={handleDeleteField}
              approverId={approverId}
            />
          )}

          {from === "requestView" ? (
            applicationFormFields?.length > 0 &&
            (from !== "form-management" &&
            parentTabsOfApplicationForm?.length > 0 ? (
              <DynamicTabs
                formFields={applicationFormFields}
                currentSectionIndex={currentSectionIndex}
                setCurrentSectionIndex={setCurrentSectionIndex}
                isFetchingDefaultForm={isFetchingDefaultForm}
                hideBackBtn={hideBackBtn}
                collegeId={collegeId}
                clientId={clientId}
                parentTabs={parentTabsOfApplicationForm}
                approverId={approverId}
              />
            ) : (
              <ApplicationFormWithoutParentTab
                formFields={applicationFormFields}
                currentSectionIndex={currentSectionIndex}
                setCurrentSectionIndex={setCurrentSectionIndex}
                isFetchingDefaultForm={isFetchingDefaultForm}
                hideBackBtn={hideBackBtn}
                collegeId={collegeId}
                clientId={clientId}
                parentTabs={parentTabsOfApplicationForm}
                approverId={approverId}
              />
            ))
          ) : from !== "form-management" &&
            parentTabsOfApplicationForm?.length > 0 ? (
            <DynamicTabs
              formFields={applicationFormFields}
              currentSectionIndex={currentSectionIndex}
              setCurrentSectionIndex={setCurrentSectionIndex}
              isFetchingDefaultForm={isFetchingDefaultForm}
              hideBackBtn={hideBackBtn}
              collegeId={collegeId}
              clientId={clientId}
              parentTabs={parentTabsOfApplicationForm}
              approverId={approverId}
            />
          ) : (
            <ApplicationFormWithoutParentTab
              formFields={applicationFormFields}
              currentSectionIndex={currentSectionIndex}
              setCurrentSectionIndex={setCurrentSectionIndex}
              isFetchingDefaultForm={isFetchingDefaultForm}
              hideBackBtn={hideBackBtn}
              collegeId={collegeId}
              clientId={clientId}
              parentTabs={parentTabsOfApplicationForm}
              approverId={approverId}
            />
          )}
        </>
      )}
    </>
  );
};

export default ClientDefaultForm;
