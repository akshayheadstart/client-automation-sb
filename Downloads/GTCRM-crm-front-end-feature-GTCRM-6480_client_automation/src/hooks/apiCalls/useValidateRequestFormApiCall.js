import { useValidateRequestFormMutation } from "../../Redux/Slices/clientOnboardingSlice";

export const useValidateRequestFormCaller = () => {
  const [validateRequestForm, result] = useValidateRequestFormMutation();

  const callValidateRequestForm = async ({
    url,
    clientId,
    collegeId,
    payload,
    approverId,
  }) => {
    try {
      const response = await validateRequestForm({
        url,
        clientId,
        collegeId,
        payload,
        approverId,
      }).unwrap();
      return response;
    } catch (error) {
      console.error("Validation API error", error);
      throw error;
    }
  };

  return { callValidateRequestForm, result };
};
