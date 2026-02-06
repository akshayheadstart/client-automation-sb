import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import Masonaries from "../../components/ui/template-manager/Masonaries";
import CancelIcon from "@mui/icons-material/Cancel";
import { useState } from "react";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { useContext } from "react";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleChangePage } from "../../helperFunctions/pagination";
import Pagination from "../../components/shared/Pagination/Pagination";
import { useSelector } from "react-redux";
import TableDataCount from "../../components/ui/application-manager/TableDataCount";
import { customFetch } from "../StudentTotalQueries/helperFunction";

const SelectTemplateDialog = ({
  handleClickOpenDialogsSms,
  openDialoge,
  handleClose,
  setMessageBody,
  setTemplateBody,
  from,
  setSmsType,
  setSenderName,
  setSmsDltContentId,
  setSubjectOfEmail,
  setTemplateId,
  setEmailType,
  setEmailProvider,
}) => {
  const [rowPerPageOptions, setRowsPerPageOptions] = useState([
    "5",
    "10",
    "15",
  ]);

  const [callAPI, setCallAPI] = useState(false);

  const [loading, setLoading] = useState(false);
  const [allTemplate, setAllTemplate] = useState([]);

  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  // pagination
  const [rowCount, setRowCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(0);
  const [page, setPage] = useState(0);
  const count = Math.ceil(rowCount / rowsPerPage);

  const [
    selectTemplateInternalServerError,
    setSelectTemplateInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInSelectTemplate,
    setSomethingWentWrongInSelectTemplate,
  ] = useState(false);
  const token = Cookies.get("jwtTokenCredentialsAccessToken");

  useEffect(() => {
    setPage(
      localStorage.getItem(
        from === "email"
          ? `${Cookies.get("userId")}GetAllEmailTemplatePageNo`
          : from === "sms"
          ? `${Cookies.get("userId")}GetAllSmsTemplatePageNo`
          : from === "whatsapp" &&
            `${Cookies.get("userId")}GetAllWhatsappTemplatePageNo`
      )
        ? parseInt(
            localStorage.getItem(
              from === "email"
                ? `${Cookies.get("userId")}GetAllEmailTemplatePageNo`
                : from === "sms"
                ? `${Cookies.get("userId")}GetAllSmsTemplatePageNo`
                : from === "whatsapp" &&
                  `${Cookies.get("userId")}GetAllWhatsappTemplatePageNo`
            )
          )
        : 1
    );

    setRowsPerPage(
      localStorage.getItem(
        from === "email"
          ? `${Cookies.get("userId")}GetAllEmailTemplateTableRowPerPage`
          : from === "sms"
          ? `${Cookies.get("userId")}GetAllSmsTemplateTableRowPerPage`
          : from === "whatsapp" &&
            `${Cookies.get("userId")}GetAllWhatsappTemplateTableRowPerPage`
      )
        ? parseInt(
            localStorage.getItem(
              from === "email"
                ? `${Cookies.get("userId")}GetAllEmailTemplateTableRowPerPage`
                : from === "sms"
                ? `${Cookies.get("userId")}GetAllSmsTemplateTableRowPerPage`
                : from === "whatsapp" &&
                  `${Cookies.get(
                    "userId"
                  )}GetAllWhatsappTemplateTableRowPerPage`
            )
          )
        : 5
    );
    setCallAPI(true);
  }, [from]);

  useEffect(() => {
    if (callAPI) {
      setCallAPI(false);
      setLoading(true);
      Cookies.remove("templateId");
      customFetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/templates/?draft_email_templates=false&email_templates=${
          from === "email" ? true : false
        }&own_templates=false&sms_templates=${
          from === "sms" ? true : false
        }&draft_sms_template=false&whatsapp_templates=${
          from === "whatsapp" ? true : false
        }&draft_whatsapp_template=false&page_num=${page}&page_size=${rowsPerPage}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        ApiCallHeaderAndBody(token, "POST")
      )
        .then((res) =>
          res.json().then((data) => {
            if (data?.detail === "Could not validate credentials") {
              window.location.reload();
            } else if (data?.data) {
              setLoading(false);
              try {
                if (Array.isArray(data.data)) {
                  setRowCount(data?.total);
                  setAllTemplate(data.data);
                } else {
                  throw new Error("templates API response has changed");
                }
              } catch (error) {
                setApiResponseChangeMessage(error);
                handleSomethingWentWrong(
                  setSomethingWentWrongInSelectTemplate,
                  handleClose,
                  10000
                );
              }
            } else if (data?.detail) {
              setLoading(false);
            }
          })
        )
        .catch((err) => {
          setLoading(false);
          handleInternalServerError(
            setSelectTemplateInternalServerError,
            handleClose,
            10000
          );
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, callAPI]);

  return (
    <Dialog
      sx={{
        zIndex: 2001,
      }}
      maxWidth={"lg"}
      fullScreen={true}
      open={openDialoge}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        sx={{ display: "flex", justifyContent: "space-between" }}
        variant="h5"
        id="alert-dialog-title"
      >
        <Box>Select Template</Box>
        <IconButton onClick={handleClose}>
          <CancelIcon></CancelIcon>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ px: 3 }} id="alert-dialog-description">
          {!loading && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: { md: "row", sm: "column", xs: "column" },
                justifyContent: "space-between",
              }}
            >
              <TableDataCount
                totalCount={rowCount}
                currentPageShowingCount={allTemplate.length}
                pageNumber={page}
                rowsPerPage={rowsPerPage}
              />

              {allTemplate?.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Pagination
                    className="pagination-bar"
                    currentPage={page}
                    totalCount={rowCount}
                    pageSize={rowsPerPage}
                    onPageChange={(page) =>
                      handleChangePage(
                        page,
                        from === "email"
                          ? `GetAllEmailTemplateSavePageNo`
                          : from === "sms"
                          ? `GetAllSmsTemplateSavePageNo`
                          : from === "whatsapp" &&
                            `GetAllWhatsappTemplateSavePageNo`,
                        setPage,
                        setCallAPI
                      )
                    }
                    count={count}
                  />

                  <AutoCompletePagination
                    rowsPerPage={rowsPerPage}
                    rowPerPageOptions={rowPerPageOptions}
                    setRowsPerPageOptions={setRowsPerPageOptions}
                    rowCount={rowCount}
                    page={page}
                    setPage={setPage}
                    localStorageChangeRowPerPage={
                      from === "email "
                        ? `GetAllEmailTemplateTableRowPerPage`
                        : from === "sms"
                        ? `GetAllSmsTemplateTableRowPerPage`
                        : from === "whatsapp" &&
                          `GetAllWhatsappTemplateTableRowPerPage`
                    }
                    localStorageChangePage={
                      from === "email"
                        ? `GetAllEmailTemplateSavePageNo`
                        : from === "sms"
                        ? `GetAllSmsTemplateSavePageNo`
                        : from === "whatsapp" &&
                          `GetAllWhatsappTemplateSavePageNo`
                    }
                    setRowsPerPage={setRowsPerPage}
                    setCallAPI={setCallAPI}
                  ></AutoCompletePagination>
                </Box>
              )}
            </Box>
          )}

          <Masonaries
            setSubjectOfEmail={setSubjectOfEmail}
            handleClose={handleClose}
            setMessageBody={setMessageBody}
            setTemplateBody={setTemplateBody}
            mailComponent={true}
            loading={loading}
            allTemplate={allTemplate}
            internalServerError={selectTemplateInternalServerError}
            somethingWentWrong={somethingWentWrongInSelectTemplate}
            handleClickOpenDialogsSms={handleClickOpenDialogsSms}
            setSmsType={setSmsType}
            setSenderName={setSenderName}
            setSmsDltContentId={setSmsDltContentId}
            from={from}
            setTemplateId={setTemplateId}
            setEmailType={setEmailType}
            setEmailProvider={setEmailProvider}
          ></Masonaries>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          size="medium"
          variant="contained"
          onClick={handleClose}
          autoFocus
          color="info"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectTemplateDialog;
