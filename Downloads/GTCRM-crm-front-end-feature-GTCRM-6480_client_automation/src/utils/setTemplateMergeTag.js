export const setTemplateMergeTag = ({
  isSuccess,
  setTemplateMergeKeysList,
  data,
  isError,
  error,
  pushNotification,
}) => {
  if (isSuccess) {
    if (Array.isArray(data?.merge_fields)) {
      setTemplateMergeKeysList(data?.merge_fields);
    } else {
      new Error("Template merge tag API's response has been changed");
    }
  } else if (isError) {
    if (error?.data?.detail === "Could not validate credentials") {
      window.location.reload();
    } else if (error?.data?.detail) {
      pushNotification("error", error?.data?.detail);
    }
  }
};
