import Cookies from "js-cookie";
import { handleInternalServerError } from "../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../utils/handleSomethingWentWrong";

export const handleDeleteSingleTemplate = (
  deleteTemplate,
  deleteTemplateID,
  handleCloseDeleteModal,
  setTemplateDeleted,
  templateDeleted,
  pushNotification,
  setCallAPI,
  allTemplateLength,
  page,
  setPage,
  allEmailTemplateSavePageNoLocalStorageValue,
  setCallPagination,
  setDeleteTemplateInternalServerError,
  setApiResponseChangeMessage,
  setSomethingWentWrongInDeleteTemplate,
  collegeId,
  setLoading
) => {
  setLoading && setLoading(true);
  deleteTemplate({
    deleteTemplateID,
    collegeId,
  })
    ?.unwrap()
    .then((data) => {
      if (data?.detail === "Could not validate credentials") {
        window.location.reload();
      } else if (data?.message) {
        const expectedData = data?.message;
        try {
          if (typeof expectedData === "string") {
            handleCloseDeleteModal();
            if (allTemplateLength === 1) {
              if (page > 1) {
                setPage(
                  localStorage.getItem(
                    `${Cookies.get(
                      "userId"
                    )}${allEmailTemplateSavePageNoLocalStorageValue}`
                  )
                    ? parseInt(
                        localStorage.getItem(
                          `${Cookies.get(
                            "userId"
                          )}${allEmailTemplateSavePageNoLocalStorageValue}`
                        )
                      )
                    : page - 1
                );
                localStorage.setItem(
                  `${Cookies.get(
                    "userId"
                  )}${allEmailTemplateSavePageNoLocalStorageValue}`,
                  page - 1
                );
                setCallPagination((previous) => !previous);
              } else {
                setPage(
                  localStorage.getItem(
                    `${Cookies.get(
                      "userId"
                    )}${allEmailTemplateSavePageNoLocalStorageValue}`
                  )
                    ? parseInt(
                        localStorage.getItem(
                          `${Cookies.get(
                            "userId"
                          )}${allEmailTemplateSavePageNoLocalStorageValue}`
                        )
                      )
                    : page
                );
                localStorage.setItem(
                  `${Cookies.get(
                    "userId"
                  )}${allEmailTemplateSavePageNoLocalStorageValue}`,
                  page
                );
                setCallPagination((previous) => !previous);
              }
            }
            setTemplateDeleted(!templateDeleted);
            setCallAPI && setCallAPI(true);
            pushNotification("success", "Template successfully Deleted ");
          } else {
            throw new Error("templates delete API response has changed");
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setSomethingWentWrongInDeleteTemplate,
            handleCloseDeleteModal,
            5000
          );
        }
      } else if (data?.detail) {
        pushNotification("error", data?.detail);
      }
    })
    .catch((err) => {
      handleInternalServerError(
        setDeleteTemplateInternalServerError,
        handleCloseDeleteModal,
        5000
      );
    })
    .finally(() => setLoading && setLoading(false));
};
