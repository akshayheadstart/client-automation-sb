import { useCreateFormRequestMutation } from "../../Redux/Slices/clientOnboardingSlice";

export const useCreateFormRequestCaller = () => {
  const [createFormRequest, result] = useCreateFormRequestMutation();

  const callCreateFormRequest = async ({ clientId, collegeId, payload }) => {
    try {
      const response = await createFormRequest({
        clientId,
        collegeId,
        payload,
      }).unwrap();
      return response;
    } catch (error) {
      console.error("Create form request API error", error);
      throw error;
    }
  };

  return { callCreateFormRequest, result };
};
