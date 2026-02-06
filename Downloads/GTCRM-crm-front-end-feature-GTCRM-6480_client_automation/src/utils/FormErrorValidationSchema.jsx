import * as Yup from "yup";
import { MAX_FILE_SIZE } from "../constants/LeadStageList";

export const additionalFields = {
  generalDetailsFields: [
    {
      label: "Student dashboard title",
      name: "student_dashboard_project_title",
      type: "text",
      variant: "outlined",
      required: true,
    },
    {
      label: "Admin dashboard title",
      name: "admin_dashboard_project_title",
      type: "text",
      variant: "outlined",
      required: true,
    },
    {
      label: "Transparent BG Logo URL",
      name: "logo_transparent",
      type: "url",
      variant: "outlined",
      required: true,
      validationType: "requiredURL",
    },
    {
      label: "Fab Icon URL",
      name: "fab_icon",
      type: "url",
      variant: "outlined",
      required: true,
      validationType: "requiredURL",
    },
    {
      label: "Student Dashboard Domain URL",
      name: "student_dashboard_domain",
      type: "url",
      variant: "outlined",
      required: true,
      validationTYpe: "requiredURL",
    },
    {
      label: "Student Dashboard Landing URL",
      name: "student_dashboard_landing_page_link",
      type: "url",
      variant: "outlined",
      required: true,
      validationTYpe: "requiredURL",
    },
    {
      label: "Campus Tour Video URL",
      name: "campus_tour_video_url",
      type: "url",
      variant: "outlined",
      required: true,
      validationType: "requiredURL",
    },
    {
      label: "Brochure URL",
      name: "brochure_url",
      type: "url",
      variant: "outlined",
      required: true,
      validationType: "requiredURL",
    },
    {
      label: "Google Tag Manager ID",
      name: "google_tag_manager_id",
      type: "text",
      variant: "outlined",
    },
    {
      md: 9,
      label: "Lead Tags",
      name: "lead_tags",
      type: "select",
      multiple: true,
      freeSolo: true,
      options: [],
      limitTags: 5,
      variant: "outlined",
      info: (
        <div>
          After entering a tag, press the{" "}
          <code className="info-code">Enter</code> key.
        </div>
      ),
    },
    {
      md: 6,
      label: "Student Dashboard Meta Descriptions",
      name: "student_dashboard_meta_description",
      type: "text",
      multiline: true,
      rows: 4,
      variant: "outlined",
      required: true,
    },
    {
      md: 6,
      label: "Admin Dashboard Meta Descriptions",
      name: "admin_dashboard_meta_description",
      type: "text",
      multiline: true,
      rows: 4,
      variant: "outlined",
      required: true,
    },
    {
      md: 12,
      label: "Facebook Pixel Setup Code",
      name: "facebook_pixel_setup_code",
      type: "text",
      multiline: true,
      rows: 4,
      variant: "outlined",
    },
  ],
  paymentGateway: [
    {
      label: "Payment Method",
      name: "payment_method",
      type: "select",
      variant: "outlined",
      required: true,
      options: ["icici_bank", "razorpay"],
    },
  ],
  termsAndConditionAndDeclarationText: [
    {
      label: "Terms and Condition Text",
      name: "terms_and_condition_text",
    },
    {
      label: "Declaration Text",
      name: "declaration_text",
    },
  ],
};

export const additionalFieldsInitialValues = {
  student_dashboard_project_title: "",
  admin_dashboard_project_title: "",
  logo_transparent: "",
  fab_icon: "",
  student_dashboard_domain: "",
  student_dashboard_landing_page_link: "",
  campus_tour_video_url: "",
  brochure_url: "",
  google_tag_manager_id: "",
  lead_tags: [],
  student_dashboard_meta_description: "",
  admin_dashboard_meta_description: "",
  facebook_pixel_setup_code: "",
  payment_method: "",
  lead_stages: [{ stage_name: "", sub_lead_stage: [] }],
  declaration_text: "",
  terms_and_condition_text: "",
};

export const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
];

export const additionalFieldsValidationSchema = Yup.object().shape({
  // General Details
  student_dashboard_project_title: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed")
    .required("Student dashboard title is required"),
  admin_dashboard_project_title: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed")
    .required("Admin dashboard title is required"),

  logo_transparent: Yup.string()
    .url("Invalid URL format")
    .required("Transparent BG Logo URL is required"),

  fab_icon: Yup.string()
    .url("Invalid URL format")
    .required("Fab Icon URL is required"),
  student_dashboard_domain: Yup.string()
    .url("Invalid URL format")
    .required("Student Dashboard Domain URL is required"),
  student_dashboard_landing_page_link: Yup.string()
    .url("Invalid URL format")
    .required("Student Dashboard Landing URL is required"),

  campus_tour_video_url: Yup.string().url("Invalid URL format").nullable(),

  brochure_url: Yup.string().url("Invalid URL format").nullable(),

  google_tag_manager_id: Yup.string(),
  lead_tags: Yup.array().of(Yup.string()),

  student_dashboard_meta_description: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed")
    .required("Student Dashboard Meta Description is required"),
  admin_dashboard_meta_description: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed")
    .required("Admin Dashboard Meta Description is required"),

  facebook_pixel_setup_code: Yup.string().nullable(),

  // Payment Gateway
  payment_method: Yup.string()
    .oneOf(["icici_bank", "razorpay"], "Invalid payment gateway")
    .required("Payment Method is required"),

  // Lead Stages
  lead_stages: Yup.array().of(
    Yup.object().shape({
      stage_name: Yup.string().required("Lead stage name is required"),
      sub_lead_stage: Yup.array().of(Yup.string()),
    })
  ),
});

export const s3DetailsFields = [
  { sectionTitle: "S3 Details Fields" },
  {
    label: "Username",
    name: "s3.username",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "AWS Access Key ID",
    name: "s3.aws_access_key_id",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "AWS Secret Access Key",
    name: "s3.aws_secret_access_key",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Region Name",
    name: "s3.region_name",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Assets Bucket Name",
    name: "s3.assets_bucket_name",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Reports Bucket Name",
    name: "s3.reports_bucket_name",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Public Bucket Name",
    name: "s3.public_bucket_name",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Student Documents Name",
    name: "s3.student_documents_name",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Report Folder Name",
    name: "s3.report_folder_name",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Download Bucket Name",
    name: "s3.download_bucket_name",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Demo Base Bucket URL",
    name: "s3.demo_base_bucket_url",
    type: "url",
    variant: "outlined",
    required: true,
    validationType: "requiredURL",
  },
  {
    label: "Dev Base Bucket URL",
    name: "s3.dev_base_bucket_url",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredURL",
  },
  {
    label: "Prod Base Bucket URL",
    name: "s3.prod_base_bucket_url",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredURL",
  },
  {
    label: "Stage Base Bucket URL",
    name: "s3.stage_base_bucket_url",
    type: "url",
    variant: "outlined",
    required: true,
    validationType: "requiredURL",
  },
  {
    label: "Demo Base Bucket",
    name: "s3.demo_base_bucket",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Dev Base Bucket",
    name: "s3.dev_base_bucket",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Prod Base Bucket",
    name: "s3.prod_base_bucket",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Stage Base Bucket",
    name: "s3.stage_base_bucket",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Base Folder",
    name: "s3.base_folder",
    type: "text",
    variant: "outlined",
    required: true,
  },
];
export const collPollFields = [
  { sectionTitle: "Coll Poll Details Fields" },
  {
    label: "S3 Bucket Name",
    name: "collpoll.s3_bucket_name",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Collpoll URL",
    name: "collpoll.collpoll_url",
    type: "url",
    variant: "outlined",
    required: true,
    validationType: "requiredURL",
  },
  {
    label: "Collpoll Auth Security Key",
    name: "collpoll.collpoll_auth_security_key",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Region Name",
    name: "collpoll.region_name",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "AWS Secret Access Key",
    name: "collpoll.aws_secret_access_key",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "AWS Access Key ID",
    name: "collpoll.aws_access_key_id",
    type: "text",
    variant: "outlined",
    required: true,
  },
];

export const meilisearchFields = [
  { sectionTitle: "Meilisearch Details Fields" },
  {
    label: "Meili Server Host",
    name: "meilisearch.meili_server_host",
    type: "url",
    variant: "outlined",
    required: true,
    validationType: "requiredURL",
  },
  {
    label: "Meili Server Master Key",
    name: "meilisearch.meili_server_master_key",
    type: "text",
    variant: "outlined",
    required: true,
  },
];
export const awsTextractFields = [
  { sectionTitle: "AWS Textract Details" },
  {
    label: "Textract AWS Access Key ID",
    name: "aws_textract.textract_aws_access_key_id",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Textract AWS Secret Access Key",
    name: "aws_textract.textract_aws_secret_access_key",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Textract AWS Region Name",
    name: "aws_textract.textract_aws_region_name",
    type: "text",
    variant: "outlined",
    required: true,
  },
];
export const rabbitMQFields = [
  { sectionTitle: "Rabbit MQ Details" },
  {
    label: "RMQ Host",
    name: "rabbit_mq_credential.rmq_host",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "RMQ Password",
    name: "rabbit_mq_credential.rmq_password",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "RMQ URL",
    name: "rabbit_mq_credential.rmq_url",
    type: "text",
    variant: "outlined",
    required: true,
    // validationType: "requiredURL",
  },
  {
    label: "RMQ Username",
    name: "rabbit_mq_credential.rmq_username",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "RMQ Port",
    name: "rabbit_mq_credential.rmq_port",
    type: "text",
    variant: "outlined",
    required: true,
  },
];
export const razorpayFields = [
  { sectionTitle: "Razorpay Details" },
  {
    label: "Razorpay API Key",
    name: "razorpay.razorpay_api_key",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Razorpay Secret",
    name: "razorpay.razorpay_secret",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Razorpay Webhook Secret",
    name: "razorpay.razorpay_webhook_secret",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Razorpay Partner",
    name: "razorpay.partner",
    type: "select",
    variant: "outlined",
    required: true,
    options: ["Yes", "No"],
  },
  {
    label: "X Razorpay Account",
    name: "razorpay.x_razorpay_account",
    type: "text",
    variant: "outlined",
    required: true,
  },
];
export const cacheRedisFields = [
  { sectionTitle: "Cache Redis Details" },
  {
    label: "Redis Host",
    name: "cache_redis.host",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Redis Port",
    name: "cache_redis.port",
    type: "number",
    variant: "outlined",
    required: true,
    validationType: "requiredNumber",
  },
  {
    label: "Redis Password",
    name: "cache_redis.password",
    type: "password",
    variant: "outlined",
    required: true,
  },
];

export const zoomCredentialsFields = [
  { sectionTitle: "Zoom Credentials Details" },
  {
    label: "Zoom Client ID",
    name: "zoom_credentials.client_id",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Zoom Client Secret",
    name: "zoom_credentials.client_secret",
    type: "password",
    variant: "outlined",
    required: true,
  },
  {
    label: "Zoom Account ID",
    name: "zoom_credentials.account_id",
    type: "text",
    variant: "outlined",
    required: true,
  },
];
export const whatsappCredentialsFields = [
  { sectionTitle: "Whatsapp Credentials Details" },
  {
    label: "WhatsApp Send URL",
    name: "whatsapp_credential.send_whatsapp_url",
    type: "url",
    variant: "outlined",
    required: true,
    validationType: "requiredURL",
  },
  {
    label: "WhatsApp Token URL",
    name: "whatsapp_credential.generate_whatsapp_token",
    type: "url",
    variant: "outlined",
    required: true,
    validationType: "requiredURL",
  },
  {
    label: "WhatsApp Username",
    name: "whatsapp_credential.whatsapp_username",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "WhatsApp Password",
    name: "whatsapp_credential.whatsapp_password",
    type: "password",
    variant: "outlined",
    required: true,
  },
  {
    label: "WhatsApp Sender Number",
    name: "whatsapp_credential.whatsapp_sender",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredNumber",
  },
];

export const otherConfigurationFields = [
  { sectionTitle: "Other Configuration Details" },
  {
    label: "Tawk Secret Key",
    name: "tawk_secret",
    type: "password",
    variant: "outlined",
    required: true,
  },
  {
    label: "Telephony Secret Key",
    name: "telephony_secret",
    type: "password",
    variant: "outlined",
    required: true,
  },
  {
    label: "Report Webhook API Key",
    name: "report_webhook_api_key",
    type: "password",
    variant: "outlined",
    required: true,
  },
];

export const smsFields = [
  { sectionTitle: "SMS Details" },
  {
    label: "SMS Transactional Username",
    name: "sms.username_trans",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "SMS Promotional Username",
    name: "sms.username_pro",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "SMS Password",
    name: "sms.password",
    type: "password",
    variant: "outlined",
    required: true,
  },
  {
    label: "SMS Authorization Token",
    name: "sms.authorization",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "SMS Country Code Prefix",
    name: "sms.sms_send_to_prefix",
    type: "text",
    variant: "outlined",
    required: true,
  },
];

export const validationSchemas = (field) => {
  return {
    requiredFile: Yup.mixed()
      .required(`${field?.label} is required`)
      .test(
        "fileType",
        "Only JPG, JPEG, PNG, and GIF files are allowed",
        (value) => value && SUPPORTED_FORMATS.includes(value.type)
      )
      .test(
        "fileSize",
        "File size must be less than 5MB",
        (value) => value && value.size <= MAX_FILE_SIZE
      ),
    nonRequiredFile: Yup.mixed()
      .nullable()
      .notRequired()
      .test(
        "fileType",
        "Only JPG, JPEG, PNG, and GIF files are allowed",
        (value) => {
          if (value) {
            return SUPPORTED_FORMATS.includes(value.type);
          } else {
            return true;
          }
        }
      )
      .test("fileSize", "File size must be less than 5MB", (value) => {
        if (value) {
          return value.size <= MAX_FILE_SIZE;
        } else {
          return true;
        }
      }),
    requiredEmail: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    requiredText: Yup.string().required(`${field?.label} is required`),
    requiredNumber: Yup.number()
      .typeError(`${field.label} must be a number`)
      .required(`${field?.label} is required`),
    nonRequiredNumber: Yup.number()
      .typeError(`${field.label} must be a number`)
      .nullable(),
    nonRequiredText: Yup.string(),
    tagPicker: Yup.array(),
    requiredURL: Yup.string()
      .url("Invalid URL format")
      .required(`${field?.label} is required`),
    nonRequiredURL: Yup.string().nullable().url("Invalid URL format"),
    requiredDate: Yup.date()
      .typeError("Invalid date format")
      .required(`${field?.label} is required`)
      .when([], (_, schema) =>
        field?.minRefDate
          ? schema.min(
              Yup.ref(field?.minRefDate),
              `Date must be after ${field?.minRefDate
                .split("_")
                .join(" ")} field's date`
            )
          : schema
      ),
  };
};

export function formValidationSchema(fields, formikValues, needWithoutShape) {
  const validationFields = [];
  fields.forEach((field) => {
    if (field?.name) {
      validationFields.push([
        field.name,
        validationSchemas(field)[field?.validationType || "requiredText"],
      ]);
    }
    if (field?.dependentField) {
      field.dependentField[formikValues[field.name]]?.map((dependentField) => {
        validationFields.push([
          dependentField.name,
          validationSchemas(dependentField)[
            dependentField.validationType || "requiredText"
          ],
        ]);
      });
    }
  });
  return needWithoutShape
    ? validationFields
    : Yup.object().shape(Object.fromEntries(validationFields));
}

export const schoolNamesField = {
  md: 12,
  label: "Add School Names",
  name: "add_school_names",
  type: "select",
  multiple: true,
  freeSolo: true,
  options: [],
  limitTags: 4,
  variant: "outlined",
  validationType: "tagPicker",
  info: (
    <div>
      After entering a school, press the{" "}
      <code className="info-code">Enter</code> key.
    </div>
  ),
};

export const courseDetailsFields = [
  {
    label: "Course Name",
    name: "course_name",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "School Name",
    name: "school_name",
    type: "select",
    variant: "outlined",
    options: [],
    validationType: "nonRequiredText",
  },
  {
    label: "Course Type",
    name: "course_type",
    type: "select",
    variant: "outlined",
    required: true,
    options: ["UG", "PG", "PHD"],
  },
  {
    label: "Course Activation Date",
    name: "course_activation_date",
    type: "date",
    variant: "outlined",
    required: true,
    validationType: "requiredDate",
  },
  {
    label: "Course Deactivation Date",
    name: "course_deactivation_date",
    type: "date",
    variant: "outlined",
    required: true,
    validationType: "requiredDate",
    disablePast: true,
    minRefDate: "course_activation_date",
  },
  {
    label: "Duration Year Count",
    name: "duration",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredNumber",
    disablePast: true,
  },
  // {
  //   label: "Separate form per Specialization?",
  //   name: "do_you_want_different_form_for_each_specialization",
  //   type: "select",
  //   variant: "outlined",
  //   required: true,
  //   options: ["Yes", "No"],
  // },
  {
    label: "Course Banner URL",
    name: "course_banner_url",
    type: "url",
    variant: "outlined",
    required: false,
    validationType: "nonRequiredURL",
  },
  {
    label: "Course Fees",
    name: "course_fees",
    type: "number",
    variant: "outlined",
    required: true,
    validationType: "requiredNumber",
  },
  // {
  //   md: 12,
  //   label: "Specialization Names",
  //   name: "specialization_names",
  //   defaultValue: [],
  //   type: "select",
  //   multiple: true,
  //   freeSolo: true,
  //   options: [],
  //   limitTags: 3,
  //   variant: "outlined",
  //   validationType: "tagPicker",
  //   info: (
  //     <div>
  //       After entering a specialization, press the{" "}
  //       <code className="info-code">Enter</code> key.
  //     </div>
  //   ),
  // },
  {
    md: 12,
    label: "Course Description",
    name: "course_description",
    type: "text",
    variant: "outlined",
    required: false,
    validationType: "nonRequiredText",
    multiline: true,
    rows: 3,
  },
];

export const preferenceDetailsFields = [
  {
    label: "Do you want preference based system? ",
    name: "do_you_want_preference_based_system",
    type: "select",
    variant: "outlined",
    required: true,
    options: ["Yes", "No"],
    dependentField: {
      Yes: [
        {
          label: "How Many Preference Do You Want?",
          name: "how_many_preference_do_you_want",
          type: "number",
          variant: "outlined",
          required: true,
          validationType: "requiredNumber",
        },
      ],
      No: [],
    },
  },
  {
    label: "Will Student able to create Multiple Application?",
    name: "will_student_able_to_create_multiple_application",
    type: "select",
    variant: "outlined",
    required: true,
    options: ["Yes", "No"],
  },
  {
    label: "Maximum Fee Limit",
    name: "maximum_fee_limit",
    variant: "outlined",
    validationType: "nonRequiredNumber",
  },
];

export const additionalPreferenceFeesFields = (preferenceCount) => {
  const additionalFields = [];
  const validationFields = [];
  for (let i = 1; i <= preferenceCount; i++) {
    const field = {
      label: `Fees of Trigger ${i}`,
      name: `fees_of_trigger.trigger_${i}`,
      type: "number",
      variant: "outlined",
      required: true,
      validationType: "requiredNumber",
    };
    additionalFields.push(field);
    validationFields.push([
      field.name.split(".")[1],
      validationSchemas(field)[field?.validationType],
    ]);
  }
  return {
    fields: additionalFields,
    validation: validationFields,
  };
};

export const preferenceManagementFormInitialValues = {
  do_you_want_preference_based_system: "",
  will_student_able_to_create_multiple_application: "",
  maximum_fee_limit: "",
};

export const customFieldValidationSchema = Yup.object({
  fieldName: Yup.string("Enter your field name").required(
    "Field Name is required"
  ),
  key_name: Yup.string("Enter your key name")
    .min(4, "Key Name should be of minimum 4 characters length")
    .required("Key Name is required"),
  field_type: Yup.string("").required("Field Type is required"),
});

export const createClientFormFields = {
  generalDetailsFields: [
    {
      label: "Client name",
      name: "client_name",
      type: "text",
      variant: "outlined",
      required: true,
    },
    {
      label: "Client email",
      name: "client_email",
      type: "email",
      variant: "outlined",
      required: true,
      validationType: "requiredEmail",
    },
    {
      label: "Client phone",
      name: "client_phone",
      type: "number",
      variant: "outlined",
      required: true,
      validationType: "requiredNumber",
    },
    {
      label: "Website URL",
      name: "websiteUrl",
      type: "url",
      variant: "outlined",
      required: true,
      validationType: "requiredURL",
    },
    {
      label: "Assigned Account Managers",
      name: "assigned_account_managers",
      type: "select",
      md: 12,
      multiple: true,
      options: [],
      apiCallFunction: "fetchAccountManagers",
      validationType: "tagPicker",
      loading: false,
      limitTags: 3,
      getOptionLabel: (option) =>
        `${option?.first_name} ${option?.middle_name} ${option?.last_name}` ||
        "",
    },
  ],
  addressDetailsFields: [
    { sectionTitle: "Address Details" },

    {
      label: "Country Name",
      name: "address.country_code",
      type: "select",
      variant: "outlined",
      required: true,
      options: [],
      resetFields: ["address.state_code", "address.city_name"],
      apiCallFunction: "fetchCountries",
      loading: false,
      getOptionLabel: (option) => option?.name || "",
      validationType: "na",
    },
    {
      label: "State Name",
      name: "address.state_code",
      type: "select",
      variant: "outlined",
      required: true,
      options: [],
      resetFields: ["address.city_name"],
      dependsOn: ["country_code"],
      apiCallFunction: "fetchStates",
      getOptionLabel: (option) => option?.name || "",
      validationType: "na",
    },
    {
      label: "City Name",
      name: "address.city_name",
      type: "select",
      variant: "outlined",
      required: true,
      options: [],
      dependsOn: ["country_code", "state_code"],
      dependsOnApiParams: ["countryIso", "stateIso"],
      apiCallFunction: "fetchCities",
      getOptionLabel: (option) => option?.name || "",
      validationType: "na",
    },
    {
      label: "Address Line 1",
      name: "address.address_line_1",
      type: "text",
      variant: "outlined",
      required: true,
    },
    {
      label: "Address Line 2",
      name: "address.address_line_2",
      type: "text",
      variant: "outlined",
      validationType: "nonRequiredText",
    },
  ],
  pocDetailsFields: [
    {
      label: "Name",
      name: "name",
      type: "text",
      variant: "outlined",
      required: true,
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      variant: "outlined",
      required: true,
      validationType: "requiredEmail",
    },
    {
      label: "Mobile Number",
      name: "mobile_number",
      type: "number",
      variant: "outlined",
      required: true,
      validationType: "requiredNumber",
    },
  ],
};

export const createClientFormInitialValues = {
  client_name: "",
  client_email: "",
  client_phone: "",
  assigned_account_managers: [],
  websiteUrl: "",
  address: {
    address_line_1: "",
    address_line_2: "",
    country_code: "",
    state_code: "",
    city_name: "",
  },
  POCs: [
    {
      name: "",
      email: "",
      mobile_number: "",
    },
  ],
};

const stringValidationOptions = [
  {
    label: "Maximum",
    value: "max",
    validationValueField: {
      type: "number",
      validationType: "requiredNumber",
    },
  },
  {
    label: "Minimum",
    value: "min",
    validationValueField: {
      type: "number",
      validationType: "requiredNumber",
    },
  },
  {
    label: "Length",
    value: "length",
    validationValueField: {
      type: "number",
      validationType: "requiredNumber",
    },
  },
  {
    label: "Uppercase",
    value: "uppercase",
  },
  {
    label: "Lowercase",
    value: "lowercase",
  },
  {
    label: "Only Characters (A-Z)",
    value: "matches",
    validationValue: "/^[a-zA-Z]+$/",
  },
  {
    label: "Characters and Numbers",
    value: "matches",
    validationValue: "/^[a-zA-Z0-9]+$/",
  },
];

const numberValidationOptions = [
  ...stringValidationOptions.slice(0, 2),
  {
    label: "More Than",
    value: "moreThan",
    validationValueField: {
      type: "number",
      validationType: "requiredNumber",
    },
  },
  {
    label: "Less Than",
    value: "lessThan",
    validationValueField: {
      type: "number",
      validationType: "requiredNumber",
    },
  },
  {
    label: "Length",
    value: "test",
    validationValueField: {
      type: "number",
      validationType: "requiredNumber",
    },
  },
];

const dateValidationOptions = [
  {
    label: "Maximum",
    value: "max",
    validationValueField: {
      type: "date",
      validationType: "requiredDate",
    },
  },
  {
    label: "Minimum",
    value: "min",
    validationValueField: {
      type: "date",
      validationType: "requiredDate",
    },
  },
];

const fileValidationOptions = [
  {
    label: "Max File Size in MB",
    value: "test",
    validationValueField: {
      type: "number",
      validationType: "requiredNumber",
    },
  },
];

export const returnValidationOptions = {
  text: stringValidationOptions,
  url: stringValidationOptions,
  email: stringValidationOptions,
  number: numberValidationOptions,
  file: fileValidationOptions,
  date: dateValidationOptions,
};

export const getValidationTypeOfCurrentValidation = (
  currentField,
  editValidation
) => {
  const validationOptions =
    returnValidationOptions?.[currentField?.field_type] || [];
  return validationOptions.find(
    (validation) => validation.value === editValidation.type
  );
};

export const returnFieldsWithValidations = ({
  fields,
  targetKeyPath,
  validations,
}) => {
  const updatedFields = structuredClone(fields);
  function addValidations(fieldArray, path) {
    if (path.length === 0) return;
    let keyName = path[0];
    let remainingPath = path.slice(1);
    for (let field of fieldArray) {
      if (field.key_name === keyName) {
        if (remainingPath.length === 0) {
          // We are at the target field
          field.validations = validations;
        } else {
          // Recurse deeper
          if (field.dependent_fields?.logical_fields) {
            for (let option in field.dependent_fields.logical_fields) {
              addValidations(
                field.dependent_fields.logical_fields[option].fields,
                remainingPath
              );
            }
          }
        }
      }
    }
  }
  addValidations(updatedFields, targetKeyPath);
  return updatedFields;
};

// this function returns feature permission create form with validation based on the dashboard (student/admin)
export const returnFeaturePermissionCreateFields = (dashboard) => {
  const defaultValue = {
    name: "",
    description: "",
    visibility: false,
  };

  const validationSchema = {
    name: Yup.string().required("Feature Name is required"),
    visibility: Yup.boolean(),
    description: Yup.string().required("Feature Description is required"),
  };

  const fields = [
    {
      label: "Unique Feature Name",
      name: "name",
      type: "text",
      required: true,
    },
    {
      label: "Feature Visibility?",
      name: "visibility",
      type: "switch",
      required: true,
      validationType: "requiredSwitch",
    },
  ];
  if (dashboard === "admin_dashboard") {
    fields.push({
      label: "Is Need API?",
      name: "need_api",
      type: "switch",
      validationType: "requiredSwitch",
      dependentFields: {
        true: [
          {
            label: "API Read Permission?",
            name: "permissions.read",
            type: "switch",
            validationType: "requiredSwitch",
          },
          {
            label: "API Write Permission?",
            name: "permissions.write",
            type: "switch",
            validationType: "requiredSwitch",
          },
          {
            label: "API Edit Permission?",
            name: "permissions.edit",
            type: "switch",
            validationType: "requiredSwitch",
          },
          {
            label: "API Delete Permission?",
            name: "permissions.delete",
            type: "switch",
            validationType: "requiredSwitch",
          },
          // { will need in future
          //   label: "Download Permission?",
          //   name: "permissions.download",
          //   type: "switch",
          //   validationType: "requiredSwitch",
          // },
        ],
        false: [],
      },
    });
    defaultValue.permissions = {
      read: false,
      write: false,
      edit: false,
      delete: false,
      // download: false,
    };
    defaultValue.need_api = false;
    validationSchema.permissions = Yup.object().shape({
      read: Yup.boolean(),
      write: Yup.boolean(),
      edit: Yup.boolean(),
      delete: Yup.boolean(),
      // download: Yup.boolean(),
    });
    validationSchema.need_api = Yup.boolean();
  }
  fields.push({
    label: "Feature Description",
    name: "description",
    type: "text",
    validationType: "notRequiredText",
    required: true,
    md: 12,
    rows: 3,
    multiline: true,
  });

  return {
    fields,
    defaultValue,
    validationSchema: Yup.object().shape(validationSchema),
  };
};

// this function returns create group feature permission form with validation based on the dashboard (student/admin)
export const returnGroupCreationFields = (dashboard) => {
  const defaultValue = {
    group_name: "",
    group_description: "",
  };

  const validationSchema = {
    group_name: Yup.string().required("Group Name is required"),
    group_description: Yup.string().required("Group Description is required"),
  };

  const fields = [
    {
      label: "Unique Group Name",
      name: "group_name",
      type: "text",
      required: true,
      md: 12,
    },
    {
      label: "Group Description",
      name: "group_description",
      type: "text",
      validationType: "notRequiredText",
      required: true,
      md: 12,
      rows: 3,
      multiline: true,
    },
  ];

  return {
    fields,
    defaultValue,
    validationSchema: Yup.object().shape(validationSchema),
  };
};
export const easyBuzzFields = [
  { sectionTitle: "Easy buzz Details Fields" },
  {
    label: "Base Url",
    name: "payment_gateways.easy_buzz.base_url",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Environment",
    name: "payment_gateways.easy_buzz.environment",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Merchant Key",
    name: "payment_gateways.easy_buzz.merchant_key",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Merchant Salt",
    name: "payment_gateways.easy_buzz.merchant_salt",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Retrieve Url",
    name: "payment_gateways.easy_buzz.retrieve_url",
    type: "text",
    variant: "outlined",
    required: true,
  },
];
export const eazyPayFields = [
  { sectionTitle: "Eazy Pay Details Fields" },
  {
    label: "Encryption key",
    name: "payment_gateways.eazypay.encryption_key",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Merchant Id",
    name: "payment_gateways.eazypay.merchant_id",
    type: "text",
    variant: "outlined",
    required: true,
  },
];
export const hdfcFields = [
  { sectionTitle: "HDFC Details Fields" },
  {
    label: "Base Url",
    name: "payment_gateways.hdfc.base_url",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Customer Id",
    name: "payment_gateways.hdfc.customer_id",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Environment",
    name: "payment_gateways.hdfc.environment",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Key",
    name: "payment_gateways.hdfc.key",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Merchant Id",
    name: "payment_gateways.hdfc.merchant_id",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Retrieve Url",
    name: "payment_gateways.hdfc.retrieve_url",
    type: "text",
    variant: "outlined",
    required: true,
  },
];
export const payuFields = [
  { sectionTitle: "Payu Details Fields" },
  {
    label: "Merchant key",
    name: "payment_gateways.payu.merchant_key",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Merchant Salt",
    name: "payment_gateways.payu.merchant_salt",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Retrieve Url",
    name: "payment_gateways.payu.retrieve_url",
    type: "text",
    variant: "outlined",
    required: true,
  },
];
export const razorpayForCollegeFields = [
  { sectionTitle: "Razorpay Details Fields" },
  {
    label: "Razorpay Partner",
    name: "payment_gateways.razorpay.partner",
    type: "select",
    variant: "outlined",
    required: true,
    options: ["true", "false"],
  },
  {
    label: "Razorpay Api Key",
    name: "payment_gateways.razorpay.razorpay_api_key",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Razorpay Secret",
    name: "payment_gateways.razorpay.razorpay_secret",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Razorpay webhook Secret",
    name: "payment_gateways.razorpay.razorpay_webhook_secret",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "X Razorpay Account",
    name: "payment_gateways.razorpay.x_razorpay_account",
    type: "text",
    variant: "outlined",
    required: true,
  },
];
export const cacheRadisFields = [
  { sectionTitle: "Cache Radis Details Fields" },

  {
    label: "Host",
    name: "cache_redis.host",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredText",
  },
  {
    label: "Port",
    name: "cache_redis.port",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredText",
  },
  {
    label: "Password",
    name: "cache_redis.password",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredText",
  },
];
export const enforcementsFields = [
  { sectionTitle: "Enforcements Details Fields" },
  {
    label: "Lead limit",
    name: "enforcements.lead_limit",
    type: "number",
    variant: "outlined",
    required: true,
    validationType: "requiredNumber",
  },
  {
    label: "Counselor Limit",
    name: "enforcements.counselor_limit",
    type: "number",
    variant: "outlined",
    required: true,
    validationType: "requiredNumber",
  },
  {
    label: "Client Manager Limit",
    name: "enforcements.client_manager_limit",
    type: "number",
    variant: "outlined",
    required: true,
    validationType: "requiredNumber",
  },
  {
    label: "publisher Account Limit",
    name: "enforcements.publisher_account_limit",
    type: "number",
    variant: "outlined",
    required: true,
    validationType: "requiredNumber",
  },
];
export const chargesPerReleaseFields = [
  { sectionTitle: "Charges Per Release Details Fields" },
  {
    label: "For SMS",
    name: "charges_per_release.forSMS",
    type: "number",
    variant: "outlined",
    required: true,
    validationType: "requiredNumber",
  },
  {
    label: "For Email",
    name: "charges_per_release.forEmail",
    type: "number",
    variant: "outlined",
    required: true,
    validationType: "requiredNumber",
  },
  {
    label: "For WhatApp",
    name: "charges_per_release.forWhatsapp",
    type: "number",
    variant: "outlined",
    required: true,
    validationType: "requiredNumber",
  },
  {
    label: "For Lead",
    name: "charges_per_release.forLead",
    type: "number",
    variant: "outlined",
    required: true,
    validationType: "requiredNumber",
  },
];
export const publisherBulkLeadPushLimitFields = [
  { sectionTitle: "Publisher bulk lead push limit Details Fields" },
  {
    label: "Bulk limit",
    name: "publisher_bulk_lead_push_limit.bulk_limit",
    type: "number",
    variant: "outlined",
    required: true,
    validationType: "requiredNumber",
  },
  {
    label: "Daily limit",
    name: "publisher_bulk_lead_push_limit.daily_limit",
    type: "number",
    variant: "outlined",
    required: true,
    validationType: "requiredNumber",
  },
];
export const mcubeFields = [
  { sectionTitle: "Mcube Details Fields" },
  {
    label: "key",
    name: "telephony_cred.mcube.key",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredText",
  },
  {
    label: "OutBound Url",
    name: "telephony_cred.mcube.outbound_url",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredText",
  },
];
export const mcube2Fields = [
  { sectionTitle: "Mcube 2 Details Fields" },
  {
    label: "key",
    name: "telephony_cred.mcube2.key",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredText",
  },
  {
    label: "OutBound Url",
    name: "telephony_cred.mcube2.outbound_url",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredText",
  },
];
export const paymentConfigurationsFields = [
  { sectionTitle: "Payment Configurations Details Fields" },
  {
    label: "Allow Payment",
    name: "payment_configurations[0].allow_payment",
    type: "select",
    variant: "outlined",
    required: true,
    options: ["true", "false"],
  },
  {
    label: "Application Wise",
    name: "payment_configurations[0].application_wise",
    type: "select",
    variant: "outlined",
    required: true,
    options: ["true", "false"],
  },
  {
    label: "Apply promo voucher",
    name: "payment_configurations[0].apply_promo_voucher",
    type: "select",
    variant: "outlined",
    required: true,
    options: ["true", "false"],
  },
  {
    label: "Apply Scholarship",
    name: "payment_configurations[0].apply_scholarship",
    type: "select",
    variant: "outlined",
    required: true,
    options: ["true", "false"],
  },
  {
    label: "Payment Gateway",
    name: "payment_configurations[0].payment_gateway",
    type: "select",
    variant: "outlined",
    required: true,
    multiple: true,
    options: [],
  },
  {
    label: "Payment  Key",
    name: "payment_configurations[0].payment_key",
    type: "text",
    variant: "outlined",
    required: true,
  },

  {
    label: "Payment  Name",
    name: "payment_configurations[0].payment_name",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Show Status",
    name: "payment_configurations[0].show_status",
    type: "select",
    variant: "outlined",
    required: true,
    options: ["true", "false"],
  },
];
export const paymentModeFields = [
  { sectionTitle: "Payment Mood Details Fields" },
  {
    label: "Payment offline Mood",
    name: "payment_configurations[0].payment_mode.offline",
    type: "select",
    variant: "outlined",
    required: true,
    options: ["true", "false"],
  },
  {
    label: "Payment Online Mood",
    name: "payment_configurations[0].payment_mode.online",
    type: "select",
    variant: "outlined",
    required: true,
    options: ["true", "false"],
  },
];
export const otherConfigFields = [
  { sectionTitle: "Others Details Fields" },
  {
    label: "Preferred Payment Gateway",
    name: "preferred_payment_gateway",
    type: "select",
    variant: "outlined",
    required: true,
    options: [],
    validationType: "requiredText",
  },
  {
    label: "Payment Successfully Mail Message",
    name: "payment_successfully_mail_message",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredText",
  },
  {
    label: "User Limit",
    name: "users_limit",
    type: "number",
    variant: "outlined",
    required: true,
    validationType: "requiredNumber",
  },
  {
    label: "Report Webhook Api Key",
    name: "report_webhook_api_key",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredText",
  },
  {
    label: "Telephony Secret",
    name: "telephony_secret",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredText",
  },
  {
    label: "Email Display Name",
    name: "email_display_name",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredText",
  },
  {
    label: "S3 Base Folder",
    name: "s3_base_folder",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredText",
  },
];
export const junoErpFirstUrlFields = [
  { sectionTitle: "Juno Erp First Url Details Fields" },
  {
    label: "Authorization",
    name: "juno_erp.first_url.authorization",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Juno Url",
    name: "juno_erp.first_url.juno_url",
    type: "text",
    variant: "outlined",
    required: true,
  },
];
export const junoProgRefFields = [
  { sectionTitle: "Juno Erp Program Ref Details Fields" },
  {
    label: "Program ref",
    name: "juno_erp.prog_ref",
    type: "text",
    variant: "outlined",
    required: true,
  },
];
export const junoErpSecondUrlFields = [
  { sectionTitle: "Juno Erp Second Url Details Fields" },
  {
    label: "Authorization",
    name: "juno_erp.second_url.authorization",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Juno Url",
    name: "juno_erp.second_url.juno_url",
    type: "text",
    variant: "outlined",
    required: true,
  },
];
export const emailCredentialsFields = [
  { sectionTitle: "Email Credentials Details Fields" },
  {
    label: "Username",
    name: "email_credentials.payload_username",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredText",
  },
  {
    label: "Password",
    name: "email_credentials.payload_password",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredText",
  },
  {
    label: "Payload Form Email",
    name: "email_credentials.payload_from",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredEmail",
  },
  {
    label: "Source",
    name: "email_credentials.source",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredEmail",
  },
];
export const emailConfigurationsFields = [
  { sectionTitle: "Email Configurations Details Fields" },
  {
    label: "Verification Email Subject",
    name: "email_configurations.verification_email_subject",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredText",
  },
  {
    label: "Contact Us Number",
    name: "email_configurations.contact_us_number",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredNumber",
  },
  {
    label: "University Email Title",
    name: "email_configurations.university_email_name",
    type: "text",
    variant: "outlined",
    required: true,
  },
  {
    label: "Banner Image",
    name: "email_configurations.banner_image",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredURL",
  },
  {
    label: "Email Logo",
    name: "email_configurations.email_logo",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredURL",
  },
];
export const seasonsFields = [
  { sectionTitle: "Seasons Details Fields" },
  {
    label: "Season Name",
    name: "seasons[0].season_name",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredText",
  },
  {
    label: "Start Date",
    name: "seasons[0].start_date",
    type: "date",
    variant: "outlined",
    required: true,
    validationType: "requiredDate",
  },
  {
    label: "End Date",
    name: "seasons[0].end_date",
    type: "date",
    variant: "outlined",
    required: true,
    validationType: "requiredDate",
  },
];
export const seasonDataBaseFields = [
  { sectionTitle: "Season DataBase Details Fields" },
  {
    label: "Database Username",
    name: "seasons[0].database.username",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredText",
  },
  {
    label: "Database Password",
    name: "seasons[0].database.password",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredText",
  },
  {
    label: "Database Url",
    name: "seasons[0].database.url",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredURL",
  },
  {
    label: "DB Name",
    name: "seasons[0].database.db_name",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredText",
  },
];
export const universityDetailsFields = [
  { sectionTitle: "University Details Fields" },
  {
    label: "University Mail",
    name: "university_details.university_contact_us_mail",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredEmail",
  },
  {
    label: "University Website Url",
    name: "university_details.university_website_url",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredURL",
  },
  {
    label: "University Prefix Name",
    name: "university_details.university_prefix_name",
    type: "text",
    variant: "outlined",
    required: true,
    validationType: "requiredText",
  },
];

export const specializationSchema = Yup.object().shape({
  specialization_names: Yup.array().of(
    Yup.object().shape({
      spec_name: Yup.string().required("Specialization name is required"),
      is_activated: Yup.boolean(),
      spec_custom_id: Yup.string().required(
        "Specialization ID name is required"
      ),
      spec_fees: Yup.number()
        .typeError(`Specialization Fees must be a number`)
        .nullable(),
    })
  ),
});
