import * as yup from "yup";

export const generalNumberValidation = (e) =>
  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

export const nameValidation = (e) => {
  const charMatcher = /^[a-zA-Z\s]*$/;
  if (!charMatcher.test(e.key)) {
    e.preventDefault();
  }
};

export const regexToValidateDate = () =>
  /^\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}\sam|pm$/;

export const validateWebsiteUrl = (url) => {
  // Improved regex to match a wide range of valid URLs
  const regex =
    /^(https?:\/\/)?((([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])+\.)+[a-zA-Z]{2,})(\/[^\s]*)?$/;
  return regex.test(url);
};

export const addressValidation = (e) => {
  if (e.key === ";") e.preventDefault();
};

export const clientBasicInfoValidationSchema = yup.object({
  name: yup.string("Enter your name").required("Name is required"),
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  phoneNumber: yup
    .string("Enter your phone number")
    .matches(/^\d{10}$/, "Phone Number should be exactly 10 digits")
    .required("Phone number is required"),
  address_line_1: yup.string().required("Address Line 1 is required"),
  address_line_2: yup.string().nullable(),
});
