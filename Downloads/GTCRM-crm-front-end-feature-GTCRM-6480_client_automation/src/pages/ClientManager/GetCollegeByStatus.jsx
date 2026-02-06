import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Popover } from "rsuite";
import { validateWebsiteUrl } from "../../components/shared/forms/Validation";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ClientCreationDialog from "../../components/shared/ClientRegistration/ClientCreationDialog";
import DeleteDialogue from "../../components/shared/Dialogs/DeleteDialogue";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import Pagination from "../../components/shared/Pagination/Pagination";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import { handleChangePage } from "../../helperFunctions/pagination";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import useToasterHook from "../../hooks/useToasterHook";
import {
  useClientRegistrationMutation,
  useGetCollegesByStatusQuery,
  usePrefetch,
  useUpdateCollegeStatusMutation,
} from "../../Redux/Slices/applicationDataApiSlice";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import ClientFormEditDialog from "./ClientFormEditDialog";
import ClientFormListTable from "./ClientFormListTable";
import "../../styles/ClientRegistration.css";
import useGetCountryAndStateDetails from "../../hooks/useGetCountryAndStateDetails";
import ClientMainInfoPage from "../../components/shared/ClientRegistration/ClientMainInfoPage";
import UploadLogoAndBg from "../../components/shared/ClientRegistration/UploadLogoAndBg";
import NextAndBackButton from "../../components/shared/ClientRegistration/NextAndBackButton";
import FormFields from "../../components/shared/ClientRegistration/FormFields";
import AddedCourseTable from "../../components/shared/ClientRegistration/AddedCourseTable";
import DifferentFormForEachCourse from "../../components/shared/ClientRegistration/DifferentFormForEachCourse";
import AllApplicationForm from "../UserAccessControl/AllApplicationForm";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import CoursePreferenceAndFeesRules from "../../components/shared/ClientRegistration/CoursePreferenceAndFeesRules";

function GetCollegeByStatus({ info, editForm, statusOptions }) {
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  const { pending, approve, reject, pageNumberKey, rowPerPageKey } = info;

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
  const [formStep, setFormStep] = useState(0);

  const [allSchools, setAllSchools] = useState([]);
  const [school, setSchool] = useState("");
  const [allCourses, setAllCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
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

  // existing form fields state
  const [allExistingFields, setAllExistingFields] = useState({});
  const [regFromFields, setRegFormFields] = useState([]);
  const [basicDetailsFields, setBasicDetailsFields] = useState([]);
  const [documentDetailsFields, setDocumentDetailsFields] = useState([]);
  const [fatherDetailsFields, setFatherDetailsFields] = useState([]);
  const [motherDetailsFields, setMotherDetailsFields] = useState([]);
  const [guardianDetailsFields, setGuardianDetailsFields] = useState([]);
  const [diplomaDetailsFields, setDiplomaDetailsFields] = useState([]);
  const [presentAddressFields, setPresentAddressFields] = useState([]);
  const [permanentAddressFields, setPermanentAddressFields] = useState([]);
  const [tenthDetailsFields, setTenthDetailsFields] = useState([]);
  const [tenthSubjectWiseDetailsFields, setTenthSubjectWiseDetailsFields] =
    useState([]);
  const [twelveDetailsFields, setTwelveDetailsFields] = useState([]);
  const [twelveSubjectWiseDetailsFields, setTwelveSubjectWiseDetailsFields] =
    useState([]);
  const [graduationDetailsFields, setGraduationDetailsFields] = useState([]);
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

  const [clientFormEditOpen, setClientFormEditOpen] = useState(false);

  // states for pagination
  const applicationPageNo = localStorage.getItem(
    `${Cookies.get("userId")}${pageNumberKey}`
  )
    ? parseInt(localStorage.getItem(`${Cookies.get("userId")}${pageNumberKey}`))
    : 1;

  const tableRowPerPage = localStorage.getItem(
    `${Cookies.get("userId")}${rowPerPageKey}`
  )
    ? parseInt(localStorage.getItem(`${Cookies.get("userId")}${rowPerPageKey}`))
    : 25;
  const [pageNumber, setPageNumber] = useState(applicationPageNo);
  const [rowsPerPage, setRowsPerPage] = useState(tableRowPerPage);
  const [rowCount, setRowCount] = useState();
  const [allColleges, setAllColleges] = useState([]);
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [hideColleges, setHideColleges] = useState(false);
  const [totalColleges, setTotalColleges] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const pushNotification = useToasterHook();

  const count = Math.ceil(rowCount / rowsPerPage);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  // we are differentiating course data based on different course
  useEffect(() => {
    if (needDifferentForm && allCourses.length) {
      const updatedData = [];
      const existingFields = structuredClone(allExistingFields);
      allCourses.forEach((course) => {
        const data = {
          course_name: course.courseName,
          ...existingFields,
          student_registration_form_fields: regFromFields,
        };
        updatedData.push(data);
      });
      setDifferentCourseFormFields(updatedData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needDifferentForm, allCourses]);

  const {
    data: collegeData,
    isSuccess,
    isFetching,
    error,
    isError,
  } = useGetCollegesByStatusQuery({
    pageNumber,
    rowsPerPage,
    approve,
    pending,
    reject,
  });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (collegeData.detail) {
          pushNotification("error", collegeData.detail);
          setAllColleges([]);
          setTotalColleges(0);
          setRowCount(0);
          return;
        }
        if (Array.isArray(collegeData?.data)) {
          setAllColleges(collegeData.data);
          setTotalColleges(collegeData.total);
          setRowCount(collegeData.total);
        } else {
          throw new Error("get college by status API response has changed");
        }
      }

      if (isError) {
        setTotalColleges(0);
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setIsInternalServerError,
            setHideColleges,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setIsSomethingWentWrong, setHideColleges, 10000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, error, isError, isSuccess, navigate, collegeData]);

  // we are differentiating course data based on different course
  useEffect(() => {
    if (allCourses.length) {
      if (needDifferentForm) {
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
      } else {
        setBasicDetailsFields(allExistingFields?.basic_details_form_fields);
        setDocumentDetailsFields(allExistingFields?.document_details);
        setFatherDetailsFields(
          allExistingFields?.parent_details_form_fields
            .father_details_form_fields
        );
        setMotherDetailsFields(
          allExistingFields?.parent_details_form_fields
            .mother_details_form_fields
        );
        setGuardianDetailsFields(allExistingFields?.guardian_details_fields);
        setPermanentAddressFields(
          allExistingFields?.address_details_fields.permanent_address
        );
        setPresentAddressFields(
          allExistingFields?.address_details_fields.address_for_correspondence
        );
        setTenthDetailsFields(
          allExistingFields?.educational_details.tenth_details
            .tenth_academic_details
        );
        setTenthSubjectWiseDetailsFields(
          allExistingFields?.educational_details.tenth_details
            .tenth_subject_wise_details
        );
        setTwelveDetailsFields(
          allExistingFields?.educational_details.twelve_details
            .twelve_academic_details
        );
        setTwelveSubjectWiseDetailsFields(
          allExistingFields?.educational_details.twelve_details
            .twelve_subject_wise_details
        );
        setGraduationDetailsFields(
          allExistingFields?.educational_details.graduation_details
        );
        setDiplomaDetailsFields(
          allExistingFields?.educational_details.diploma_academic_details
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needDifferentForm, allCourses]);

  // use react hook for prefetch data
  const prefetchCollegeList = usePrefetch("getCollegesByStatus");
  useEffect(() => {
    apiCallFrontAndBackPage(
      collegeData,
      rowsPerPage,
      pageNumber,
      prefetchCollegeList
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collegeData, pageNumber, prefetchCollegeList, rowsPerPage]);

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
                isSomethingWentWrong,
                setHideColleges,
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
                setIsSomethingWentWrong,
                setHideColleges,
                10000
              );
            }
          }
        })
        .catch(() => {
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
                  setIsSomethingWentWrong,
                  setHideColleges,
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

  const [updateCollegeStatus] = useUpdateCollegeStatusMutation();
  const handleUpdateStatus = (e) => {
    e.preventDefault();
    setStatusUpdateLoading(true);
    updateCollegeStatus({
      status: selectedStatus.value,
      collegeId: selectedCollegeId,
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
            } else {
              throw new Error("client status update API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(setIsSomethingWentWrong, "", 5000);
          }
        } else if (data.detail) {
          pushNotification("error", data?.detail);
        }
      })
      .catch((error) => {
        if (error.status === 500) {
          handleInternalServerError(setIsInternalServerError, "", 5000);
        } else {
          pushNotification("error", error.data?.detail);
        }
      })
      .finally(() => {
        setStatusUpdateLoading(false);
      });
  };
  function transformArrayToObject(arr) {
    let result = {};
    arr.forEach((item) => {
      if (item.leadstageName !== undefined) {
        result[item.leadstageName] = item.label || [];
      }
    });
    return result;
  }

  function transformObjectToArray(obj) {
    let result = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result.push({ leadstageName: key, label: obj[key] });
      }
    }
    return result;
  }

  const dataForCreatingNewCollege = {
    name: clientName,
    logo: logoAndBg.logo,
    favicon_url: logoAndBg.background,
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
      collegeId: selectedCollegeId,
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
            } else {
              throw new Error("client registration API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(isSomethingWentWrong, "", 5000);
          }
        } else if (data.detail) {
          pushNotification("error", data?.detail);
        }
      })
      .catch((error) => {
        if (error.status === 500) {
          handleInternalServerError(isInternalServerError, "", 5000);
        } else {
          pushNotification("error", error.data?.detail);
        }
      })
      .finally(() => {
        setLoading(false);
        setClientFormEditOpen(false);
        setFormStep(0);
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
    setSchool(course?.school);
    setCourseSpecializations(course.courseSpecializations);
    setIsCoursePg(course.isCoursePg);
    setCourseActivationDate(course?.courseActivationDate);
    setCourseDeactivationDate(course?.courseDeactivationDate);
  };

  const addedCourseTableFunctions = {
    setPreferenceAndFeesCalculation,
    preferenceAndFeesCalculation,
    setClickedSpecialization: setViewItem,
    setOpenSpecializationDialog: setOpenDetailsDialog,
    handleCourseEdit,
    handleDeleteCourse,
    allCourses,
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
    tenthSubjectWiseDetailsFields,
    setTenthSubjectWiseDetailsFields,
    twelveSubjectWiseDetailsFields,
    setTwelveSubjectWiseDetailsFields,
    diplomaDetailsFields,
    setDiplomaDetailsFields,
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
        .catch(() => {
          handleInternalServerError(setIsInternalServerError, "", 5000);
        })
        .finally(() => setUploadLoading(false));
    } else {
      pushNotification("warning", "Please select images.");
    }
  };
  const { getCountryDetails, getStateDetails } = useGetCountryAndStateDetails();
  const handleUpdateAllTheFormFieldWithExistingData = (
    existingData,
    editForm
  ) => {
    getCountryDetails(
      existingData?.address?.country_code,
      setSelectedCountryCode
    );
    getStateDetails(
      existingData?.address?.country_code,
      existingData?.address?.state,
      setStateResetValue,
      setSelectedStateCode
    );

    if (editForm) {
      setClientFormEditOpen(true);
    } else {
      setOpenDetailsDialog(true);
      setTitleOfDialog("Preview");
    }

    setLeadStages(transformObjectToArray(existingData?.lead_stage_label));
    setHtmlTemplateURL(existingData?.website_html_url);
    setBrochureURL(existingData?.brochure_url);
    setCampusTourYoutubeURL(existingData?.campus_tour_video_url);
    setThankyouPageURL(existingData?.thank_you_page_url);
    setCampusTourYoutubeURL(existingData?.thank_you_page_url);
    setGoogleTagManagerID(existingData?.google_tag_manager_id);
    setProjectTitle(existingData?.project_title);
    setMetaDescription(existingData?.project_meta_description);
    setUsingAnyCRM(existingData?.current_crm_usage);
    setNameOfTheCRM(existingData?.name_of_current_crm);
    setOldDataMoveTOCRM(existingData?.old_data_migration);
    setEmailSource(existingData?.email_credentials?.source);
    setEmailContactUsNumber(existingData?.email_credentials?.contact_us_number);
    setUniversityEmailName(
      existingData?.email_credentials?.university_email_name
    );
    setVerificationEmailSubject(
      existingData?.email_credentials?.verification_email_subject
    );
    setSmsUsernameTrans(existingData?.sms_credentials?.username_trans);
    setSmsUsernamePro(existingData?.sms_credentials?.username_pro);
    setSmsPassword(existingData?.sms_credentials?.password);
    setSmsAuthorization(existingData?.sms_credentials?.authorization);
    setSmsSendToPrefix(existingData?.sms_credentials?.sms_send_to_prefix);

    setWhatsAppSendUrl(existingData?.whatsapp_credentials?.send_whatsapp_url);
    setWhatsAppGenerateToken(
      existingData?.whatsapp_credentials?.generate_whatsapp_token
    );
    setWhatsAppUsername(existingData?.whatsapp_credentials?.whatsapp_username);
    setWhatsappPassword(existingData?.whatsapp_credentials?.whatsapp_password);
    setWhatsappSender(existingData?.whatsapp_credentials?.whatsapp_sender);
    setPreferenceCount(existingData?.system_preference?.preference_count || 0);
    setNeedCoursePreference(
      existingData?.system_preference?.preference || false
    );
    setAdditionalFeesRules(existingData?.fee_rules?.additional_fees || []);
    setFeeLimit(existingData?.fee_rules?.fee_cap || 0);
    setMultipleApplicationMode(
      existingData?.multiple_application_mode || false
    );
    setPreferenceAndFeesCalculation({
      base_fees: { ...existingData?.fee_rules?.base_fees },
    });

    setrazorpay_api_key(existingData?.razorpay_credentials?.razorpay_api_key);
    setrazorpay_secret(existingData?.razorpay_credentials?.razorpay_secret);
    setrazorpay_webhook_secret(
      existingData?.razorpay_credentials?.razorpay_webhook_secret
    );
    setpartner(existingData?.razorpay_credentials?.partner);
    setx_razorpay_account(
      existingData?.razorpay_credentials?.x_razorpay_account
    );

    setaws_s3_credentialsusername(existingData?.aws_s3_credentials?.username);
    setaws_s3_credentialsaws_access_key_id(
      existingData?.aws_s3_credentials?.aws_access_key_id
    );
    setaws_s3_credentialstextract_aws_region_name(
      existingData?.aws_s3_credentials?.textract_aws_region_name
    );

    setredis_cache_credentialshost(existingData?.redis_cache_credentials?.host);
    setredis_cache_credentialsport(existingData?.redis_cache_credentials?.port);
    setredis_cache_credentialspassword(
      existingData?.redis_cache_credentials?.password
    );

    settextract_aws_access_key_id(
      existingData?.aws_textract_credentials?.textract_aws_access_key_id
    );
    settextract_aws_secret_access_key(
      existingData?.aws_textract_credentials?.textract_aws_secret_access_key
    );
    settextract_aws_region_name(
      existingData?.aws_textract_credentials?.textract_aws_region_name
    );

    settawk_secret(existingData?.tawk_secret);
    settelephony_secret(existingData?.telephony_secret);
    setreport_webhook_api_key(existingData?.report_webhook_api_key);
    setmeili_server_host(
      existingData?.meilisearch_credentials?.meili_server_host
    );
    setmeili_server_master_key(
      existingData?.meilisearch_credentials?.meili_server_master_key
    );
    setuniversity_contact_us_mail(
      existingData?.university_info?.university_contact_us_mail
    );
    setuniversity_admission_website_url(
      existingData?.university_info?.university_admission_website_url
    );
    setSystemTags(existingData?.lead_tags);

    setSelectedCollegeId(existingData?.id);
    setClientName(existingData?.name);
    setAddressLine1(existingData?.address?.address_line_1);
    setAddressLine2(existingData?.address?.address_line_2);
    setCityResetValue({ name: existingData?.address?.city });
    setSelectedCityName(existingData?.address?.city);
    setWebsiteUrl(existingData?.dashboard_domain);
    setPocName(existingData?.pocs[0]?.name);
    setPocEmail(existingData?.pocs[0]?.email);
    setPocMobile(existingData?.pocs[0]?.mobile_number);
    setLeadManagementSystem(
      existingData?.subscriptions?.lead_management_system
    );
    setAppManagementSystem(existingData?.subscriptions?.app_management_system);
    setRawDataModule(existingData?.subscriptions?.raw_data_module);
    setActivationDate(new Date(existingData?.status_info?.activation_date));
    setDeactivationDate(new Date(existingData?.status_info?.deactivation_date));
    setLeadLimit(existingData?.enforcements?.lead_limit);
    setCounselorLimit(existingData?.enforcements?.counselor_limit);
    setPublisherAccountLimit(
      existingData?.enforcements?.publisher_account_limit
    );
    setCollegeManagerLimit(existingData?.enforcements?.client_manager_limit);
    setSmsChargesPerRelease(existingData?.charges_details?.per_sms_charge);
    setEmailChargesPerRelease(existingData?.charges_details?.per_email_charge);
    setWhatsappChargesPerRelease(
      existingData?.charges_details?.per_whatsapp_charge
    );
    setCollegeManagerName(existingData?.college_manager_name[0]);
    setNeedDifferentForm(existingData?.is_different_forms);
    setLogoAndBg({
      logo: existingData?.logo,
      background: existingData?.favicon_url,
    });
    setAllCourses(existingData?.course_details);

    if (existingData?.is_different_forms) {
      let allDifferentForm = Object.values(existingData?.form_details);
      setRegFormFields(allDifferentForm[0]?.student_registration_form_fields);
      setAllExistingFields(allDifferentForm[0]);
      setDifferentCourseFormFields(allDifferentForm);
    } else {
      setRegFormFields(
        existingData?.form_details?.student_registration_form_fields
      );
      setBasicDetailsFields(
        existingData?.form_details?.basic_details_form_fields
      );
      setFatherDetailsFields(
        existingData?.form_details?.parent_details_form_fields
          .father_details_form_fields
      );
      setMotherDetailsFields(
        existingData?.form_details?.parent_details_form_fields
          .mother_details_form_fields
      );
      setGuardianDetailsFields(
        existingData?.form_details?.guardian_details_fields
      );
      setPermanentAddressFields(
        existingData?.form_details?.address_details_fields.permanent_address
      );
      setPresentAddressFields(
        existingData?.form_details?.address_details_fields
          .address_for_correspondence
      );
      setTenthDetailsFields(
        existingData?.form_details?.educational_details.tenth_details
          .tenth_academic_details
      );
      setTenthSubjectWiseDetailsFields(
        existingData?.form_details?.educational_details.tenth_details
          .tenth_subject_wise_details
      );
      setTwelveDetailsFields(
        existingData?.form_details?.educational_details.twelve_details
          .twelve_academic_details
      );
      setTwelveSubjectWiseDetailsFields(
        existingData?.form_details?.educational_details.twelve_details
          .twelve_subject_wise_details
      );
      setGraduationDetailsFields(
        existingData?.form_details?.educational_details.graduation_details
      );
      setDiplomaDetailsFields(
        existingData?.form_details?.educational_details.diploma_academic_details
      );
      setAllExistingFields(existingData?.form_details);
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

  const speaker = (
    <Popover>
      <form onSubmit={handleUpdateStatus}>
        {statusUpdateLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <CircularProgress size={25} color="info" />
          </Box>
        )}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Autocomplete
            disablePortal
            getOptionLabel={(option) => option.label}
            options={statusOptions}
            sx={{ width: 250 }}
            size="small"
            onChange={(_, value) => setSelectedStatus(value)}
            renderInput={(params) => (
              <TextField
                required
                size="small"
                {...params}
                label="Select Status"
                color="info"
              />
            )}
          />
          <Button size="small" variant="outlined" type="submit">
            Submit
          </Button>
        </Box>
      </form>
    </Popover>
  );

  return (
    <Box>
      {isInternalServerError || isSomethingWentWrong ? (
        <Box>
          {isInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {isSomethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Box sx={{ display: hideColleges ? "none" : "block" }}>
          {isFetching ? (
            <Box className="loader-container">
              <LeefLottieAnimationLoader width={150} height={150} />
            </Box>
          ) : (
            <Card sx={{ p: 2, mt: 2 }}>
              <CardHeader sx={{ p: 0 }} title={`Total ${totalColleges} List`} />
              {allColleges?.length > 0 ? (
                <ClientFormListTable
                  data={allColleges}
                  editForm={editForm}
                  speaker={speaker}
                  setSelectedCollegeId={setSelectedCollegeId}
                  setExistingField={handleUpdateAllTheFormFieldWithExistingData}
                />
              ) : (
                <Box className="loader-container">
                  <BaseNotFoundLottieLoader height={250} width={250} />
                </Box>
              )}
              {allColleges?.length > 0 && (
                <Box className="pagination-container-client-manager">
                  <Pagination
                    className="pagination-bar"
                    currentPage={pageNumber}
                    totalCount={rowCount}
                    pageSize={rowsPerPage}
                    onPageChange={(page) =>
                      handleChangePage(page, pageNumberKey, setPageNumber)
                    }
                    count={count}
                  />

                  <AutoCompletePagination
                    rowsPerPage={rowsPerPage}
                    rowPerPageOptions={rowPerPageOptions}
                    setRowsPerPageOptions={setRowsPerPageOptions}
                    rowCount={rowCount}
                    page={pageNumber}
                    setPage={setPageNumber}
                    localStorageChangeRowPerPage={rowPerPageKey}
                    localStorageChangePage={pageNumberKey}
                    setRowsPerPage={setRowsPerPage}
                  ></AutoCompletePagination>
                </Box>
              )}
            </Card>
          )}
        </Box>
      )}

      <ClientCreationDialog
        clientMainPageInfoPageFieldState={clientMainPageInfoPageFieldState}
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
      <DeleteDialogue
        openDeleteModal={openDeleteDialog}
        handleDeleteSingleTemplate={() => handleDeleteCourse(deleteIndex)}
        handleCloseDeleteModal={() => setOpenDeleteDialog(false)}
      />

      <ClientFormEditDialog
        open={clientFormEditOpen}
        onClose={() => {
          setClientFormEditOpen(false);
          setFormStep(0);
        }}
      >
        {formStep === 0 && (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!validateWebsiteUrl(websiteUrl)) {
                  pushNotification("warning", "Website URL is invalid.");
                } else if (String(pocMobile).length !== 10) {
                  pushNotification(
                    "warning",
                    "POC Mobile Number Must Be 10 Digit."
                  );
                } else {
                  setFormStep(1);
                }
              }}
            >
              <Typography variant="h6">Client Basic Information</Typography>
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
                addedCourseTableFunctions={addedCourseTableFunctions}
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
                handleClientRegistration={handleClientRegistration}
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
                  handleBack={() => setFormStep(3)}
                  handleNext={() => setFormStep(5)}
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
              preferenceAndFeesCalculation={preferenceAndFeesCalculation}
              setPreferenceAndFeesCalculation={setPreferenceAndFeesCalculation}
              setAdditionalFeesRules={setAdditionalFeesRules}
              additionalFeesRules={additionalFeesRules}
              feeLimit={feeLimit}
              setFeeLimit={setFeeLimit}
              multipleApplicationMode={multipleApplicationMode}
              setMultipleApplicationMode={setMultipleApplicationMode}
            />
          </Box>
        )}
      </ClientFormEditDialog>
    </Box>
  );
}

export default GetCollegeByStatus;
