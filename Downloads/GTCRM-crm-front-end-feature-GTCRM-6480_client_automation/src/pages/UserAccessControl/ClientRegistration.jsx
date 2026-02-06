import React, { useContext, useEffect, useState } from "react";
import { Grid, Box, Card, Typography, Button } from "@mui/material";

import "../../styles/ClientRegistration.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import useToasterHook from "../../hooks/useToasterHook";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import ClientCreationDialog from "../../components/shared/ClientRegistration/ClientCreationDialog";
import AddedCourseTable from "../../components/shared/ClientRegistration/AddedCourseTable";
import ClientMainInfoPage from "../../components/shared/ClientRegistration/ClientMainInfoPage";
import FormFields from "../../components/shared/ClientRegistration/FormFields";
import AllApplicationForm from "./AllApplicationForm";
import NextAndBackButton from "../../components/shared/ClientRegistration/NextAndBackButton";
import DifferentFormForEachCourse from "../../components/shared/ClientRegistration/DifferentFormForEachCourse";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import UploadLogoAndBg from "../../components/shared/ClientRegistration/UploadLogoAndBg";
import axios from "axios";
import DeleteDialogue from "../../components/shared/Dialogs/DeleteDialogue";
import { useClientRegistrationMutation } from "../../Redux/Slices/applicationDataApiSlice";
import { validateWebsiteUrl } from "../../components/shared/forms/Validation";
import { useSelector } from "react-redux";
import CoursePreferenceAndFeesRules from "../../components/shared/ClientRegistration/CoursePreferenceAndFeesRules";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";

function ClientRegistration() {
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);

  const pushNotification = useToasterHook();
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [cityResetValue, setCityResetValue] = React.useState({ name: "" });
  const [stateResetValue, setStateResetValue] = React.useState({ name: "" });
  const [leadStages, setLeadStages] = useState([]);

  const [clientName, setClientName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [pocName, setPocName] = useState("");
  const [pocEmail, setPocEmail] = useState("");
  const [pocMobile, setPocMobile] = useState("");
  const [htmlTemplateURL, setHtmlTemplateURL] = useState("");
  const [brochureURL, setBrochureURL] = useState("");
  const [campusTourYoutubeURL, setCampusTourYoutubeURL] = useState("");
  const [thankyouPageURL, setThankyouPageURL] = useState("");
  const [googleTagManagerID, setGoogleTagManagerID] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const [rawDataModule, setRawDataModule] = useState(false);
  const [leadManagementSystem, setLeadManagementSystem] = useState(false);
  const [appManagementSystem, setAppManagementSystem] = useState(false);
  const [usingAnyCRM, setUsingAnyCRM] = useState(false);
  const [nameOfTheCRM, setNameOfTheCRM] = useState("");
  const [oldDataMoveTOCRM, setOldDataMoveTOCRM] = useState("");
  const [emailSource, setEmailSource] = useState("");
  const [emailContactUsNumber, setEmailContactUsNumber] = useState("");
  const [universityEmailName, setUniversityEmailName] = useState("");
  const [verificationEmailSubject, setVerificationEmailSubject] = useState("");
  const [smsUsernameTrans, setSmsUsernameTrans] = useState("");
  const [smsUsernamePro, setSmsUsernamePro] = useState("");
  const [smsPassword, setSmsPassword] = useState("");
  const [smsAuthorization, setSmsAuthorization] = useState("");
  const [smsSendToPrefix, setSmsSendToPrefix] = useState("");

  const [whatsAppSendUrl, setWhatsAppSendUrl] = useState("");
  const [whatsAppGenerateToken, setWhatsAppGenerateToken] = useState("");
  const [whatsAppUsername, setWhatsAppUsername] = useState("");
  const [whatsappPassword, setWhatsappPassword] = useState("");
  const [whatsappSender, setWhatsappSender] = useState("");

  // razorpay

  const [razorpay_api_key, setrazorpay_api_key] = useState("");
  const [razorpay_secret, setrazorpay_secret] = useState("");
  const [razorpay_webhook_secret, setrazorpay_webhook_secret] = useState("");
  const [partner, setpartner] = useState(false);
  const [x_razorpay_account, setx_razorpay_account] = useState("");

  //aws_s3_credentials
  const [aws_s3_credentialsusername, setaws_s3_credentialsusername] =
    useState("");
  const [
    aws_s3_credentialsaws_access_key_id,
    setaws_s3_credentialsaws_access_key_id,
  ] = useState("");
  const [
    aws_s3_credentialstextract_aws_region_name,
    setaws_s3_credentialstextract_aws_region_name,
  ] = useState("");

  //redis_cache_credentials
  const [redis_cache_credentialshost, setredis_cache_credentialshost] =
    useState("");
  const [redis_cache_credentialsport, setredis_cache_credentialsport] =
    useState("");
  const [redis_cache_credentialspassword, setredis_cache_credentialspassword] =
    useState("");

  //aws_textract_credentials

  const [textract_aws_access_key_id, settextract_aws_access_key_id] =
    useState("");
  const [textract_aws_secret_access_key, settextract_aws_secret_access_key] =
    useState("");
  const [textract_aws_region_name, settextract_aws_region_name] = useState("");

  const [tawk_secret, settawk_secret] = useState("");

  const [telephony_secret, settelephony_secret] = useState("");
  const [report_webhook_api_key, setreport_webhook_api_key] = useState("");
  const [meili_server_host, setmeili_server_host] = useState("");
  const [meili_server_master_key, setmeili_server_master_key] = useState("");
  const [university_contact_us_mail, setuniversity_contact_us_mail] =
    useState("");
  const [
    university_admission_website_url,
    setuniversity_admission_website_url,
  ] = useState("");
  const [systemTags, setSystemTags] = useState([]);

  const [leadLimit, setLeadLimit] = useState("");
  const [counselorLimit, setCounselorLimit] = useState("");
  const [collegeManagerLimit, setCollegeManagerLimit] = useState("");
  const [publisherAccountLimit, setPublisherAccountLimit] = useState("");
  const [activationDate, setActivationDate] = useState();
  const [deactivationDate, setDeactivationDate] = useState();
  const [collegeManagerName, setCollegeManagerName] = useState("");
  const [
    somethingWentWrongInClientRegistration,
    setSomethingWentWrongInClientRegistration,
  ] = useState(false);
  const [hideClientRegistration, setHideClientRegistration] = useState(false);
  const [
    clientRegistrationInternalServerError,
    setClientRegistrationInternalServerError,
  ] = useState(false);
  const [formStep, setFormStep] = useState(0);

  const [allCourses, setAllCourses] = useState([]);

  const [courseName, setCourseName] = useState("");
  const [allSchools, setAllSchools] = useState([]);
  const [school, setSchool] = useState("");
  const [courseSpecializations, setCourseSpecializations] = useState([]);
  const [courseActivationDate, setCourseActivationDate] = useState(new Date());
  const [courseDeactivationDate, setCourseDeactivationDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() + 12))
  );
  const [isCoursePg, setIsCoursePg] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [needDifferentForm, setNeedDifferentForm] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [viewItem, setViewItem] = useState([]);
  const [titleOfDialog, setTitleOfDialog] = useState("");
  const [smsChargesPerRelease, setSmsChargesPerRelease] = useState("");
  const [whatsappChargesPerRelease, setWhatsappChargesPerRelease] =
    useState("");
  const [emailChargesPerRelease, setEmailChargesPerRelease] = useState("");
  const [isClientRegLoading, setIsClientRegLoading] = useState(false);

  // existing form fields state
  const [allExistingFields, setAllExistingFields] = useState({});
  const [regFromFields, setRegFormFields] = useState([]);
  const [basicDetailsFields, setBasicDetailsFields] = useState([]);
  const [documentDetailsFields, setDocumentDetailsFields] = useState([]);
  const [fatherDetailsFields, setFatherDetailsFields] = useState([]);
  const [motherDetailsFields, setMotherDetailsFields] = useState([]);
  const [guardianDetailsFields, setGuardianDetailsFields] = useState([]);
  const [presentAddressFields, setPresentAddressFields] = useState([]);
  const [permanentAddressFields, setPermanentAddressFields] = useState([]);
  const [tenthDetailsFields, setTenthDetailsFields] = useState([]);
  const [tenthSubjectWiseDetailsFields, setTenthSubjectWiseDetailsFields] =
    useState([]);
  const [twelveDetailsFields, setTwelveDetailsFields] = useState([]);
  const [twelveSubjectWiseDetailsFields, setTwelveSubjectWiseDetailsFields] =
    useState([]);
  const [graduationDetailsFields, setGraduationDetailsFields] = useState([]);
  const [diplomaDetailsFields, setDiplomaDetailsFields] = useState([]);
  const [logoAndBg, setLogoAndBg] = useState({ logo: "", background: "" });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  // if user want's different form for each course then this state will work
  const [differentCourseFormFields, setDifferentCourseFormFields] = useState(
    []
  );

  // course preference

  const [needCoursePreference, setNeedCoursePreference] = useState(false);
  const [preferenceCount, setPreferenceCount] = useState(2);
  const [additionalFeesRules, setAdditionalFeesRules] = useState([]);
  const [feeLimit, setFeeLimit] = useState(0);
  const [multipleApplicationMode, setMultipleApplicationMode] = useState(false);

  const [preferenceAndFeesCalculation, setPreferenceAndFeesCalculation] =
    useState({ base_fees: {} });
  const navigate = useNavigate();
  const token = Cookies.get("jwtTokenCredentialsAccessToken");

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  useEffect(() => {
    setHeadTitle("Client Registration");
    document.title = "Client Registration";
  }, [headTitle]);
  // we are differentiating course data based on different course of specializations
  useEffect(() => {
    if (needDifferentForm && allCourses.length) {
      const updatedData = [];
      const existingFields = structuredClone(allExistingFields);
      allCourses.forEach((course) => {
        if (course.courseSpecializations.length > 0) {
          course.courseSpecializations.forEach((spec) => {
            const data = {
              course_name: course.courseName,
              spec_name: spec.spec_name,
              ...existingFields,
              student_registration_form_fields: regFromFields,
            };
            updatedData.push(data);
          });
        } else {
          const data = {
            course_name: course.courseName,
            spec_name: null,
            ...existingFields,
            student_registration_form_fields: regFromFields,
          };
          updatedData.push(data);
        }
      });
      setDifferentCourseFormFields(updatedData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needDifferentForm, allCourses]);
  // getting existing form details
  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/college/get_form_details/${
        collegeId ? "?college_id=" + collegeId : ""
      }`,
      ApiCallHeaderAndBody(token, "GET")
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data?.message) {
          const expectedData = data?.message;
          try {
            if (typeof expectedData === "string") {
              setRegFormFields(data.data.student_registration_form_fields);
              setBasicDetailsFields(data.data.basic_details_form_fields);
              setDocumentDetailsFields(data.data.document_details);
              setFatherDetailsFields(
                data.data.parent_details_form_fields.father_details_form_fields
              );
              setMotherDetailsFields(
                data.data.parent_details_form_fields.mother_details_form_fields
              );
              setGuardianDetailsFields(data.data.guardian_details_fields);
              setPermanentAddressFields(
                data.data.address_details_fields.permanent_address
              );
              setPresentAddressFields(
                data.data.address_details_fields.address_for_correspondence
              );
              setTenthDetailsFields(
                data.data.educational_details.tenth_details
                  .tenth_academic_details
              );
              setTenthSubjectWiseDetailsFields(
                data.data.educational_details.tenth_details
                  .tenth_subject_wise_details
              );
              setTwelveDetailsFields(
                data.data.educational_details.twelve_details
                  .twelve_academic_details
              );
              setTwelveSubjectWiseDetailsFields(
                data.data.educational_details.twelve_details
                  .twelve_subject_wise_details
              );
              setGraduationDetailsFields(
                data.data.educational_details.graduation_details
              );
              setDiplomaDetailsFields(
                data.data.educational_details.diploma_academic_details
              );
              setAllExistingFields(data.data);
            } else {
              throw new Error("Existing form field API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInClientRegistration,
              "",
              5000
            );
          }
        } else if (data.detail) {
          pushNotification("error", data?.detail);
        }
      })
      .catch(() => {
        handleInternalServerError(
          setClientRegistrationInternalServerError,
          "",
          5000
        );
      })
      .finally(() => setIsClientRegLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // getting details of charges per release
  useEffect(() => {
    setIsClientRegLoading(true);
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/college/get_component_charges/${
        collegeId ? "?college_id=" + collegeId : ""
      }`,
      ApiCallHeaderAndBody(token, "GET")
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data?.message) {
          const expectedData = data?.message;
          try {
            if (typeof expectedData === "string") {
              setSmsChargesPerRelease(data.data?.sms);
              setWhatsappChargesPerRelease(data.data?.whatsapp);
              setEmailChargesPerRelease(data.data?.email);
            } else {
              throw new Error("Charge per release API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInClientRegistration,
              "",
              5000
            );
          }
        } else if (data.detail) {
          pushNotification("error", data?.detail);
        }
      })
      .catch(() => {
        handleInternalServerError(
          setClientRegistrationInternalServerError,
          "",
          5000
        );
      })
      .finally(() => setIsClientRegLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // getting country list
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/countries/`)
      .then((res) =>
        res.json().then((data) => {
          if (data.detail) {
            pushNotification("error", data?.detail);
          } else if (data.length) {
            try {
              if (Array.isArray(data)) {
                setCountryList(data);
              } else {
                throw new Error("countries API response has changed");
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setSomethingWentWrongInClientRegistration,
                setHideClientRegistration,
                10000
              );
            }
          }
        })
      )
      .catch((err) => {
        navigate("/page500");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // getting state list
  useEffect(() => {
    if (selectedCountryCode?.iso2) {
      fetch(
        `${import.meta.env.VITE_API_BASE_URL}/countries/${
          selectedCountryCode?.iso2
        }/states/`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.detail) {
            pushNotification("error", data?.detail?.error);
          } else if (data.length) {
            try {
              if (Array.isArray(data)) {
                setStateList(data);
              } else {
                throw new Error("states API response has changed");
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setSomethingWentWrongInClientRegistration,
                setHideClientRegistration,
                10000
              );
            }
          }
        })
        .catch((err) => {
          navigate("/page500");
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountryCode]);
  // getting city list
  useEffect(() => {
    if (selectedCountryCode?.iso2 && selectedStateCode) {
      fetch(
        `${import.meta.env.VITE_API_BASE_URL}/countries/${
          selectedCountryCode?.iso2
        }/states/${selectedStateCode}/cities`
      )
        .then((res) =>
          res.json().then((data) => {
            if (data.detail) {
              pushNotification("error", data?.detail?.error);
            } else if (data.length) {
              try {
                if (Array.isArray(data)) {
                  setCityList(data);
                } else {
                  throw new Error("cities API response has changed");
                }
              } catch (error) {
                setApiResponseChangeMessage(error);
                handleSomethingWentWrong(
                  setSomethingWentWrongInClientRegistration,
                  setHideClientRegistration,
                  10000
                );
              }
            }
          })
        )
        .catch((err) => {
          navigate("/page500");
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStateCode]);

  function transformArrayToObject(arr) {
    let result = {};
    arr.forEach((item) => {
      if (item.leadstageName !== undefined) {
        result[item.leadstageName] = item.label || [];
      }
    });
    return result;
  }

  const dataForCreatingNewCollege = {
    name: clientName,
    logo: logoAndBg.logo,
    favicon_url: logoAndBg.background,
    background_image: logoAndBg.background,
    address: {
      address_line_1: addressLine1,
      address_line_2: addressLine2,
      country_code: selectedCountryCode?.iso2,
      state: selectedStateCode,
      city: selectedCityName,
    },
    dashboard_domain: websiteUrl,
    school_names: allSchools,
    lead_stage_label: transformArrayToObject(leadStages),
    lead_tags: systemTags,
    tawk_secret: tawk_secret,
    telephony_secret: telephony_secret,
    report_webhook_api_key: report_webhook_api_key,
    meilisearch_credentials: {
      meili_server_host: meili_server_host,
      meili_server_master_key: meili_server_master_key,
    },
    university_info: {
      university_contact_us_mail: university_contact_us_mail,
      university_admission_website_url: university_admission_website_url,
    },
    pocs: [
      {
        name: pocName,
        email: pocEmail,
        mobile_number: pocMobile,
      },
    ],
    razorpay_credentials: {
      razorpay_api_key: razorpay_api_key,
      razorpay_secret: razorpay_secret,
      razorpay_webhook_secret: razorpay_webhook_secret,
      partner: partner,
      x_razorpay_account: x_razorpay_account,
    },
    aws_s3_credentials: {
      username: aws_s3_credentialsusername,
      aws_access_key_id: aws_s3_credentialsaws_access_key_id,
      textract_aws_region_name: aws_s3_credentialstextract_aws_region_name,
    },
    redis_cache_credentials: {
      host: redis_cache_credentialshost,
      port: redis_cache_credentialsport,
      password: redis_cache_credentialspassword,
    },
    aws_textract_credentials: {
      textract_aws_access_key_id: textract_aws_access_key_id,
      textract_aws_secret_access_key: textract_aws_secret_access_key,
      textract_aws_region_name: textract_aws_region_name,
    },
    email_credentials: {
      source: emailSource,
      contact_us_number: emailContactUsNumber,
      university_email_name: universityEmailName,
      verification_email_subject: verificationEmailSubject,
    },
    sms_credentials: {
      username_trans: smsUsernameTrans,
      username_pro: smsUsernamePro,
      password: smsPassword,
      authorization: smsAuthorization,
      sms_send_to_prefix: smsSendToPrefix,
    },
    whatsapp_credentials: {
      send_whatsapp_url: whatsAppSendUrl,
      generate_whatsapp_token: whatsAppGenerateToken,
      whatsapp_username: whatsAppUsername,
      whatsapp_password: whatsappPassword,
      whatsapp_sender: whatsappSender,
    },
    system_preference: {
      preference: needCoursePreference,
      preference_count: parseInt(preferenceCount),
    },
    fee_rules: {
      base_fees: preferenceAndFeesCalculation?.base_fees,
      additional_fees: additionalFeesRules,
      fee_cap: feeLimit,
    },
    multiple_application_mode: multipleApplicationMode,
    current_crm_usage: usingAnyCRM,
    name_of_current_crm: nameOfTheCRM,
    old_data_migration: oldDataMoveTOCRM,
    brochure_url: brochureURL,
    campus_tour_video_url: campusTourYoutubeURL,
    website_html_url: htmlTemplateURL,
    google_tag_manager_id: googleTagManagerID,
    project_title: projectTitle,
    project_meta_description: metaDescription,
    thank_you_page_url: thankyouPageURL,
    subscriptions: {
      raw_data_module: rawDataModule,
      lead_management_system: leadManagementSystem,
      app_management_system: appManagementSystem,
    },
    enforcements: {
      lead_limit: leadLimit,
      counselor_limit: counselorLimit,
      client_manager_limit: collegeManagerLimit,
      publisher_account_limit: publisherAccountLimit,
    },
    status_info: {
      activation_date: activationDate,
      deactivation_date: deactivationDate,
    },
    college_manager_name: [collegeManagerName],
    is_different_forms: needDifferentForm,
    course_details: allCourses,
  };
  if (needDifferentForm) {
    dataForCreatingNewCollege.form_details = {
      ...differentCourseFormFields,
    };
  } else {
    dataForCreatingNewCollege.form_details = {
      basic_details_form_fields: basicDetailsFields,
      document_details: documentDetailsFields,
      guardian_details_fields: guardianDetailsFields,
      address_details_fields: {
        address_for_correspondence: presentAddressFields,
        permanent_address: permanentAddressFields,
      },
      educational_details: {
        graduation_details: graduationDetailsFields,
        diploma_academic_details: diplomaDetailsFields,
        tenth_details: {
          tenth_academic_details: tenthDetailsFields,
          tenth_subject_wise_details: tenthSubjectWiseDetailsFields,
        },
        twelve_details: {
          twelve_academic_details: twelveDetailsFields,
          twelve_subject_wise_details: twelveSubjectWiseDetailsFields,
        },
      },
      parent_details_form_fields: {
        father_details_form_fields: fatherDetailsFields,
        mother_details_form_fields: motherDetailsFields,
      },
      student_registration_form_fields: regFromFields,
    };
  }

  const [clientRegistration] = useClientRegistrationMutation();
  const handleClientRegistration = (setLoading) => {
    clientRegistration({
      payload: dataForCreatingNewCollege,
    })
      .unwrap()
      .then((data) => {
        if (data.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data?.message) {
          const expectedData = data?.message;
          try {
            if (typeof expectedData === "string") {
              pushNotification("success", data?.message);
              navigate("/pendingApproval");
            } else {
              throw new Error("client registration API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInClientRegistration,
              "",
              5000
            );
          }
        } else if (data.detail) {
          pushNotification("error", data?.detail);
        }
      })
      .catch((error) => {
        if (error.status === 500) {
          handleInternalServerError(
            setClientRegistrationInternalServerError,
            "",
            5000
          );
        } else {
          pushNotification("error", error.data?.detail);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddCourse = (event) => {
    event.preventDefault();

    if (allCourses.some((course) => course?.courseName === courseName)) {
      pushNotification("error", "Course already exist");
    } else {
      const data = {
        courseName,
        school,
        courseSpecializations,
        isCoursePg,
        courseActivationDate,
        courseDeactivationDate,
      };
      if (editIndex !== null) {
        const existingCourse = [...allCourses];
        existingCourse[editIndex] = data;
        setAllCourses(existingCourse);
      } else {
        setAllCourses((prev) => [...prev, data]);
      }
      setCourseName("");
      setSchool("");
      setCourseSpecializations([]);
      setEditIndex(null);
      setIsCoursePg(false);
      setCourseActivationDate(new Date());
      setCourseDeactivationDate(
        new Date(new Date().setMonth(new Date().getMonth() + 12))
      );
    }
  };

  const handleDeleteCourse = (index) => {
    const existingCourse = [...allCourses];
    existingCourse.splice(index, 1);
    setAllCourses(existingCourse);
    setOpenDeleteDialog(false);
  };
  const handleCourseEdit = (course, index) => {
    setEditIndex(index);
    setCourseName(course.courseName);
    setCourseSpecializations(course.courseSpecializations);
    setSchool(course?.school);
    setIsCoursePg(course.isCoursePg);
    setCourseActivationDate(course?.courseActivationDate);
    setCourseDeactivationDate(course?.courseDeactivationDate);
  };

  const addedCourseTableFunctions = {
    setClickedSpecialization: setViewItem,
    setOpenSpecializationDialog: setOpenDetailsDialog,
    handleCourseEdit,
    handleDeleteCourse,
    allCourses,
    setPreferenceAndFeesCalculation,
    preferenceAndFeesCalculation,
    setCourseName,
    courseName,
    courseSpecializations,
    setCourseSpecializations,
    setAllSchools,
    allSchools,
    school,
    setSchool,
    needDifferentForm,
    setNeedDifferentForm,
    setFormStep,
    handleAddCourse,
    setTitleOfDialog,
    courseActivationDate,
    setCourseActivationDate,
    courseDeactivationDate,
    setCourseDeactivationDate,
    isCoursePg,
    setIsCoursePg,
  };
  const clientMainPageInfoPageFieldState = {
    clientName,
    setClientName,
    addressLine1,
    setAddressLine1,
    addressLine2,
    setAddressLine2,
    countryList,
    setSelectedCountryCode,
    selectedCountryCode,
    setStateResetValue,
    setCityList,
    setCityResetValue,
    stateResetValue,
    stateList,
    setSelectedStateCode,
    cityResetValue,
    cityList,
    setSelectedCityName,
    websiteUrl,
    setWebsiteUrl,
    pocName,
    setPocName,
    pocEmail,
    setPocEmail,
    pocMobile,
    setPocMobile,
    leadManagementSystem,
    setLeadManagementSystem,
    appManagementSystem,
    usingAnyCRM,
    setUsingAnyCRM,
    nameOfTheCRM,
    setNameOfTheCRM,
    oldDataMoveTOCRM,
    setOldDataMoveTOCRM,
    emailSource,
    setEmailSource,
    emailContactUsNumber,
    setEmailContactUsNumber,
    universityEmailName,
    setUniversityEmailName,
    verificationEmailSubject,
    setVerificationEmailSubject,
    smsUsernameTrans,
    setSmsUsernameTrans,
    razorpay_api_key,
    setrazorpay_api_key,
    razorpay_secret,
    setrazorpay_secret,
    razorpay_webhook_secret,
    setrazorpay_webhook_secret,
    partner,
    setpartner,
    x_razorpay_account,
    setx_razorpay_account,

    aws_s3_credentialsusername,
    setaws_s3_credentialsusername,
    aws_s3_credentialsaws_access_key_id,
    setaws_s3_credentialsaws_access_key_id,

    aws_s3_credentialstextract_aws_region_name,
    setaws_s3_credentialstextract_aws_region_name,

    redis_cache_credentialshost,
    setredis_cache_credentialshost,
    redis_cache_credentialsport,
    setredis_cache_credentialsport,
    redis_cache_credentialspassword,
    setredis_cache_credentialspassword,

    textract_aws_access_key_id,
    settextract_aws_access_key_id,
    textract_aws_secret_access_key,
    settextract_aws_secret_access_key,
    textract_aws_region_name,
    settextract_aws_region_name,
    systemTags,
    setSystemTags,
    smsUsernamePro,
    setSmsUsernamePro,
    smsPassword,
    setSmsPassword,
    smsAuthorization,
    setSmsAuthorization,
    smsSendToPrefix,
    setSmsSendToPrefix,
    whatsAppSendUrl,
    setWhatsAppSendUrl,
    whatsAppGenerateToken,
    setWhatsAppGenerateToken,
    whatsAppUsername,
    setWhatsAppUsername,
    whatsappPassword,
    setWhatsappPassword,
    whatsappSender,
    setWhatsappSender,

    tawk_secret,
    settawk_secret,
    telephony_secret,
    settelephony_secret,
    report_webhook_api_key,
    setreport_webhook_api_key,
    university_contact_us_mail,
    setuniversity_contact_us_mail,
    university_admission_website_url,
    setuniversity_admission_website_url,
    meili_server_host,
    setmeili_server_host,
    meili_server_master_key,
    setmeili_server_master_key,

    setAppManagementSystem,
    rawDataModule,
    setRawDataModule,
    leadLimit,
    setLeadLimit,
    counselorLimit,
    setCounselorLimit,
    collegeManagerLimit,
    setCollegeManagerLimit,
    publisherAccountLimit,
    setPublisherAccountLimit,
    activationDate,
    setActivationDate,
    deactivationDate,
    setDeactivationDate,
    collegeManagerName,
    setCollegeManagerName,
    setFormStep,
    smsChargesPerRelease,
    whatsappChargesPerRelease,
    emailChargesPerRelease,
    leadStages,
    setLeadStages,
  };

  const formFieldsStates = {
    setViewItem,
    setOpenDetailsDialog,
    setTitleOfDialog,
    regFromFields,
    setRegFormFields,
    basicDetailsFields,
    setBasicDetailsFields,
    documentDetailsFields,
    setDocumentDetailsFields,
    fatherDetailsFields,
    setFatherDetailsFields,
    motherDetailsFields,
    setMotherDetailsFields,
    guardianDetailsFields,
    setGuardianDetailsFields,
    presentAddressFields,
    setPresentAddressFields,
    permanentAddressFields,
    setPermanentAddressFields,
    tenthDetailsFields,
    setTenthDetailsFields,
    twelveDetailsFields,
    setTwelveDetailsFields,
    graduationDetailsFields,
    setGraduationDetailsFields,
    diplomaDetailsFields,
    setDiplomaDetailsFields,
    tenthSubjectWiseDetailsFields,
    setTenthSubjectWiseDetailsFields,
    twelveSubjectWiseDetailsFields,
    setTwelveSubjectWiseDetailsFields,
    differentCourseFormFields,
    setDifferentCourseFormFields,
  };
  const handleUploadImage = ({
    e,
    uploadedBackground,
    uploadedLogo,
    setUploadLoading,
  }) => {
    e.preventDefault();
    if (uploadedBackground || uploadedLogo) {
      setUploadLoading(true);
      const formData = new FormData();
      uploadedLogo &&
        formData.append("files", uploadedLogo, uploadedLogo?.name);
      uploadedBackground &&
        formData.append("files", uploadedBackground, uploadedBackground?.name);
      axios
        .post(
          `${import.meta.env.VITE_API_BASE_URL}/admin/upload_files/`,
          formData,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          if (res.data.data) {
            pushNotification("success", "Uploaded successfully.");
            const images = {};
            if (res.data.data[0].length > 1) {
              images.logo = res.data.data[0][0]?.public_url;
              images.background = res.data.data[0][1]?.public_url;
              setLogoAndBg(images);
            } else {
              if (uploadedLogo)
                setLogoAndBg((prev) => ({
                  ...prev,
                  logo: res.data.data[0][0]?.public_url,
                }));
              else
                setLogoAndBg((prev) => ({
                  ...prev,
                  background: res.data.data[0][0]?.public_url,
                }));
            }
          } else if (res.detail) {
            pushNotification("error", res.detail);
          }
        })
        .catch((err) => {
          handleInternalServerError(
            setClientRegistrationInternalServerError,
            "",
            5000
          );
        })
        .finally(() => setUploadLoading(false));
    } else {
      pushNotification("warning", "Please select images.");
    }
  };

  const checkUploadLogoNextOption = () => {
    if (
      logoAndBg.logo?.length === 0 ||
      logoAndBg.background?.length === 0 ||
      !googleTagManagerID ||
      !htmlTemplateURL ||
      !projectTitle ||
      !metaDescription
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      {isClientRegLoading ? (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          data-testid="client-registration"
        >
          <LeefLottieAnimationLoader height={250} width={250} />
        </Box>
      ) : (
        <Box
          component="main"
          className="client-registration"
          sx={{ flexGrow: 1, py: 2 }}
        >
          <Box sx={{ pt: 2 }}>
            <Grid container sx={{ justifyContent: "center" }}>
              <Grid item md={10} xs={12}>
                <Card elevation={16} sx={{ p: 3 }}>
                  {somethingWentWrongInClientRegistration ||
                  clientRegistrationInternalServerError ? (
                    <>
                      {somethingWentWrongInClientRegistration && (
                        <ErrorFallback
                          error={apiResponseChangeMessage}
                          resetErrorBoundary={() => window.location.reload()}
                        />
                      )}
                      {clientRegistrationInternalServerError && (
                        <Error500Animation
                          height={400}
                          width={400}
                        ></Error500Animation>
                      )}
                    </>
                  ) : (
                    <Box
                      sx={{
                        visibility: hideClientRegistration
                          ? "hidden"
                          : "visible",
                      }}
                      className="client-registration-content"
                    >
                      {formStep === 0 && (
                        <>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (!validateWebsiteUrl(websiteUrl)) {
                                pushNotification(
                                  "warning",
                                  "Website URL is invalid."
                                );
                              } else if (pocMobile.length !== 10) {
                                pushNotification(
                                  "warning",
                                  "POC Mobile Number Must Be 10 Digit."
                                );
                              } else {
                                setFormStep(1);
                              }
                            }}
                          >
                            <ClientMainInfoPage
                              clientMainPageInfoPageFieldState={
                                clientMainPageInfoPageFieldState
                              }
                            />
                            <Box sx={{ textAlign: "right" }}>
                              <Button
                                type="submit"
                                endIcon={<NavigateNextIcon />}
                                sx={{ mt: 3 }}
                                variant="contained"
                              >
                                Next
                              </Button>
                            </Box>
                          </form>
                        </>
                      )}

                      {formStep === 1 && (
                        <Box>
                          <UploadLogoAndBg
                            handleUploadImage={handleUploadImage}
                            logoAndBg={logoAndBg}
                            setLogoAndBg={setLogoAndBg}
                            htmlTemplateURL={htmlTemplateURL}
                            setHtmlTemplateURL={setHtmlTemplateURL}
                            brochureURL={brochureURL}
                            setBrochureURL={setBrochureURL}
                            campusTourYoutubeURL={campusTourYoutubeURL}
                            setCampusTourYoutubeURL={setCampusTourYoutubeURL}
                            thankyouPageURL={thankyouPageURL}
                            setThankyouPageURL={setThankyouPageURL}
                            googleTagManagerID={googleTagManagerID}
                            setGoogleTagManagerID={setGoogleTagManagerID}
                            projectTitle={projectTitle}
                            setProjectTitle={setProjectTitle}
                            metaDescription={metaDescription}
                            setMetaDescription={setMetaDescription}
                          />
                          <NextAndBackButton
                            handleBack={() => setFormStep(0)}
                            handleNext={() => setFormStep(2)}
                            disableNext={checkUploadLogoNextOption()}
                          />
                        </Box>
                      )}

                      {formStep === 2 && (
                        <Box>
                          <FormFields
                            heading={"Student Registration Form"}
                            formFieldsStates={formFieldsStates}
                            fieldDetails={formFieldsStates.regFromFields}
                            setFieldDetails={formFieldsStates.setRegFormFields}
                          />
                          <NextAndBackButton
                            handleNext={() => setFormStep(3)}
                            handleBack={() => setFormStep(1)}
                          />
                        </Box>
                      )}
                      {formStep === 3 && (
                        <Box>
                          {
                            <AddedCourseTable
                              setOpenDeleteDialog={setOpenDeleteDialog}
                              setDeleteIndex={setDeleteIndex}
                              addedCourseTableFunctions={
                                addedCourseTableFunctions
                              }
                            />
                          }
                        </Box>
                      )}
                      {formStep === 4 && (
                        <Box>
                          {needDifferentForm ? (
                            <DifferentFormForEachCourse
                              allCourses={differentCourseFormFields}
                              formFieldsStates={formFieldsStates}
                              setFormStep={setFormStep}
                            />
                          ) : (
                            <Box>
                              <AllApplicationForm
                                heading="All"
                                formFieldsStates={formFieldsStates}
                              />
                              <NextAndBackButton
                                setOpenDetailsDialog={setOpenDetailsDialog}
                                setTitleOfDialog={setTitleOfDialog}
                                handleNext={() => setFormStep(5)}
                                handleBack={() => setFormStep(3)}
                              />
                            </Box>
                          )}
                        </Box>
                      )}
                      {formStep === 5 && (
                        <Box>
                          <CoursePreferenceAndFeesRules
                            setOpenDetailsDialog={setOpenDetailsDialog}
                            setTitleOfDialog={setTitleOfDialog}
                            handleBack={() => setFormStep(4)}
                            handleClientRegistration={handleClientRegistration}
                            setNeedCoursePreference={setNeedCoursePreference}
                            needCoursePreference={needCoursePreference}
                            setPreferenceCount={setPreferenceCount}
                            preferenceCount={preferenceCount}
                            preferenceAndFeesCalculation={
                              preferenceAndFeesCalculation
                            }
                            setPreferenceAndFeesCalculation={
                              setPreferenceAndFeesCalculation
                            }
                            setAdditionalFeesRules={setAdditionalFeesRules}
                            additionalFeesRules={additionalFeesRules}
                            feeLimit={feeLimit}
                            setFeeLimit={setFeeLimit}
                            multipleApplicationMode={multipleApplicationMode}
                            setMultipleApplicationMode={
                              setMultipleApplicationMode
                            }
                          />
                        </Box>
                      )}
                    </Box>
                  )}
                </Card>
              </Grid>
            </Grid>
          </Box>
          {openDetailsDialog && (
            <ClientCreationDialog
              clientMainPageInfoPageFieldState={
                clientMainPageInfoPageFieldState
              }
              open={openDetailsDialog}
              handleClose={() => setOpenDetailsDialog(false)}
              list={viewItem}
              titleOfDialog={titleOfDialog}
              formFieldsStates={formFieldsStates}
              regFromFields={regFromFields}
              addedCourseTableFunctions={addedCourseTableFunctions}
              needDifferentForm={needDifferentForm}
              logoAndBg={logoAndBg}
              htmlTemplateURL={htmlTemplateURL}
              brochureURL={brochureURL}
              campusTourYoutubeURL={campusTourYoutubeURL}
              thankyouPageURL={thankyouPageURL}
              googleTagManagerID={googleTagManagerID}
              projectTitle={projectTitle}
              metaDescription={metaDescription}
              setNeedCoursePreference={setNeedCoursePreference}
              needCoursePreference={needCoursePreference}
              setPreferenceCount={setPreferenceCount}
              preferenceCount={preferenceCount}
              preferenceAndFeesCalculation={preferenceAndFeesCalculation}
              setPreferenceAndFeesCalculation={setPreferenceAndFeesCalculation}
              setAdditionalFeesRules={setAdditionalFeesRules}
              additionalFeesRules={additionalFeesRules}
              feeLimit={feeLimit}
              setFeeLimit={setFeeLimit}
              multipleApplicationMode={multipleApplicationMode}
              setMultipleApplicationMode={setMultipleApplicationMode}
            />
          )}
          <DeleteDialogue
            openDeleteModal={openDeleteDialog}
            handleDeleteSingleTemplate={() => handleDeleteCourse(deleteIndex)}
            handleCloseDeleteModal={() => setOpenDeleteDialog(false)}
          />
        </Box>
      )}
    </>
  );
}

export default ClientRegistration;
