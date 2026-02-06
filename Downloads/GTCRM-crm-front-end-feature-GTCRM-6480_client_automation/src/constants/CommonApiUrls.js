// List of Course from a college
const REFRESH_TOKEN = true;
export const collegeIdToResentPassword = "628dfd41ef796e8f757a5c13";
// Sign Up ,Login URL and Logout URL
export const signUpAPI = `${
  import.meta.env.VITE_API_BASE_URL
}/student_user_crud/signup`;
export const loginAPI = `${
  import.meta.env.VITE_API_BASE_URL
}/admin/login/?refresh_token=${REFRESH_TOKEN}`;
export const logoutAPI = `${
  import.meta.env.VITE_API_BASE_URL
}/student_user_crud/logout/`;

//GET Countries API
export const getCountriesAPI = `${
  import.meta.env.VITE_API_BASE_URL
}/countries/`;

// recaptcha API verify
export const recaptchaApi = `${
  import.meta.env.VITE_API_BASE_URL
}/student_user_crud/verify_captcha/`;

// recaptcha v3 site key
export const siteKey = import.meta.env.VITE_SITE_KEY;
export const whatsappURL = "https://wa.me/91";
export const reZorPayScript = "https://checkout.razorpay.com/v1/checkout.js";
