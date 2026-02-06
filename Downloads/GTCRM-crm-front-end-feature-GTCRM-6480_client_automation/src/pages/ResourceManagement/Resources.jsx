/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Button } from "@mui/material";
import { Typography, Box, Container, Grid, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import useMediaQuery from "@mui/material/useMediaQuery";

import ManageCourseDialog from "../../components/shared/Dialogs/ManageCourseDialog";
import CategoriesList from "./CategoriesList";
import CreateSegregationForm from "./CreateSegregationForm";
import MultipleTabs from "../../components/shared/tab-panel/MultipleTabs";
import {
  useCreateKeyCategoryMutation,
  useGetKeyCategoriesQuery,
  useCreateQuestionMutation,
  useGetQuestionsMutation,
  useDeleteQuestionMutation,
  useDeleteCategoryMutation,
} from "../../Redux/Slices/applicationDataApiSlice";
import useToasterHook from "../../hooks/useToasterHook";
import SearchBox from "../../components/shared/SearchBox/SearchBox";
import ConfirmationDialog from "../../components/shared/Dialogs/ConfirmationDialog";
import useDebounce from "../../hooks/useDebounce";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";

import CreateQuestionForm from "./CreateQuestionForm";

import "../../styles/Resources.css";
import UpdateResource from "./UpdateResource";
import SendResourceDialog from "../../components/SendResourceDialog/SendResourceDialog";
import FAQList from "./FAQList";
import Script from "./Script";
import { useContext } from "react";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Resources = () => {
  const { state } = useLocation();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  // const permissions = useSelector((state) => state.authentication.permissions);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  useEffect(() => {
    if (state?.update_resource_id && state?.update_resource_id !== "None") {
      setTabValue(1);
    }
  }, [state?.update_resource_id]);
  const [isEditCategory, setIsEditCategory] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const [openFAQPopUp, setOpenFAQPopUp] = React.useState(false);
  const [questionsList, setQuestionsList] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState([]);
  const [isEditQuestionMode, setIsEditQuestionMode] = React.useState(false);
  const [editQuestionData, setEditQuestionData] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [deleteQuestionData, setDeleteQuestionData] = React.useState(null);
  const [deleteTagIndex, setDeleteTagIndex] = React.useState(null);
  const [openConfirmationDialog, setOpenConfirmationDialog] =
    React.useState(false);
  const [editTagData, setEditTagData] = React.useState(null);
  const [questionLoading, setQuestionLoading] = React.useState(false);
  // hooks
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.up("sm"));
  const pushNotification = useToasterHook();
  const debouncedSearchText = useDebounce(searchText);
  const { isLoading, data } = useGetKeyCategoriesQuery({ collegeId });
  const [createKeyCategory] = useCreateKeyCategoryMutation();
  const [createQuestion] = useCreateQuestionMutation();
  const [getQuestions] = useGetQuestionsMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const canUpdate = true;
  // const canUpdate =
  //   permissions?.menus?.resources?.resources?.features?.Resource_Update;

  const handleCategoryClick = (val) => {
    if (selectedCategory.includes(val)) {
      setSelectedCategory(selectedCategory.filter((item) => item !== val));
    } else {
      setSelectedCategory([...selectedCategory, val]);
    }
  };

  const handleAddKeyCategory = () => {
    setOpenDialog(true);
    setIsEditCategory(false);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  const handleDeleteCategory = (item) => {
    setDeleteTagIndex(item.index);
    setOpenConfirmationDialog(true);
  };

  const handleEditCategory = (item) => {
    setIsEditCategory(true);
    setOpenDialog(true);
    setEditTagData(item);
  };

  const handleAddFAQ = () => {
    setOpenFAQPopUp(true);
    setIsEditQuestionMode(false);
  };

  const handleDialogFAQClose = () => {
    setOpenFAQPopUp(false);
  };

  const handleAddTagSubmit = (payload) => {
    setLoading(true);
    createKeyCategory({
      collegeId,
      payload,
      index: isEditCategory ? editTagData.index : null,
    })
      .unwrap()
      .then((res) => {
        if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        } else if (res?.message) {
          setEditTagData(null);
          setIsEditCategory(false);
          pushNotification("success", res?.message);
        }
      })
      .catch((error) => {
        pushNotification("error", error?.data?.detail);
      })
      .finally(() => {
        setOpenDialog(false);
        setLoading(false);
      });
  };
  const [sendMessageDialogOpen, setSendMessageDialogOpen] =
    React.useState(false);
  const handleSendMessageDialogClickOpen = () => {
    setSendMessageDialogOpen(true);
  };

  const handleSendMessageDialogClose = () => {
    setSendMessageDialogOpen(false);
  };

  const handleCancelBtn = () => {
    setOpenFAQPopUp(false);
  };

  const handleEditQueClick = (editQueData) => {
    setIsEditQuestionMode(true);
    setOpenFAQPopUp(true);
    setEditQuestionData(editQueData);
  };

  const handleDeleteQueClick = (que) => {
    setDeleteQuestionData(que);
    setOpenConfirmationDialog(true);
  };

  const handleConfirmation = () => {
    setLoading(true);
    if (deleteTagIndex !== null) {
      deleteCategory({
        collegeId,
        index: deleteTagIndex,
      })
        .unwrap()
        .then((res) => {
          if (res?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (res?.detail) {
            pushNotification("error", res?.detail);
          } else if (res?.message) {
            pushNotification("success", res?.message);
            setDeleteTagIndex(null);
          }
        })
        .catch((error) => {
          pushNotification("error", error?.data?.detail);
        })
        .finally(() => {
          setOpenConfirmationDialog(false);
          setLoading(false);
        });
    } else {
      deleteQuestion({
        collegeId,
        payload: [deleteQuestionData?._id],
      })
        .unwrap()
        .then((res) => {
          if (res?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (res?.detail) {
            pushNotification("error", res?.detail);
          } else if (res?.message) {
            pushNotification("success", res?.message);
            setDeleteQuestionData(null);
            getFAQs();
          }
        })
        .catch((error) => {
          pushNotification("error", error?.data?.detail);
        })
        .finally(() => {
          setOpenConfirmationDialog(false);
          setLoading(false);
        });
    }
  };

  const handleSaveQue = (payload, isEdit) => {
    const reqPayload = {
      collegeId,
      payload,
    };
    if (isEdit) {
      reqPayload.questionId = payload._id;
    }
    setLoading(true);
    createQuestion(reqPayload)
      .unwrap()
      .then((res) => {
        if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        } else if (res?.message) {
          pushNotification("success", res?.message);
          setOpenFAQPopUp(false);
          getFAQs();
        }
      })
      .catch((error) => {
        pushNotification("error", error?.data?.detail);
      })
      .finally(() => {
        setOpenFAQPopUp(false);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    getFAQs(selectedCategory, debouncedSearchText);
  }, [collegeId, selectedCategory, debouncedSearchText]);

  const getFAQs = (tags = [], searchTxt = "") => {
    setQuestionLoading(true);
    getQuestions({
      collegeId,
      payload: { tags, search_pattern: searchTxt },
    })
      .unwrap()
      .then((res) => {
        if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        } else if (res?.message) {
          setQuestionsList(res?.data || []);
        }
      })
      .catch((error) => {
        pushNotification("error", error?.data?.detail);
      })
      .finally(() => {
        setQuestionLoading(false);
      });
  };
  const renderTabs = () => {
    return (
      <>
        <MultipleTabs
          tabArray={[
            { tabName: "FAQ" },
            { tabName: "Updates" },
            { tabName: "Script" },
          ]}
          setMapTabValue={setTabValue}
          mapTabValue={tabValue}
          boxWidth="400px"
        ></MultipleTabs>
        {tabValue === 1 && canUpdate && (
          <Button
            onClick={() => handleSendMessageDialogClickOpen()}
            sx={{ borderRadius: 50 }}
            className="send-update-button-design"
            color="info"
            variant="contained"
            size="medium"
          >
            Send Update
          </Button>
        )}
      </>
    );
  };
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  useEffect(() => {
    setHeadTitle(
      tabValue === 0 ? "FAQ" : tabValue === 1 ? "Updates" : "Script"
    );
    document.title =
      tabValue === 0 ? "FAQ" : tabValue === 1 ? "Updates" : "Script";
  }, [headTitle, tabValue]);
  const [firstEnterPageLoading, setFirstEnterPageLoading] = useState(true);

  const [getAllUpdateAPIcall, setGetAllUpdateAPIcall] = useState(false);
  const [allResourceContent, setAllResourceContent] = useState([]);
  return (
    <Box
      component="main"
      className="resources-page resources-header-box-container"
    >
      <Container
        classes={{
          root: "resources-page-container",
        }}
        sx={{ p: 0 }}
        maxWidth={false}
      >
        <Grid container>
          <Grid item md={12} sm={12} xs={12}>
            {tabValue !== 0 ? (
              <Box className="resources-box-container">{renderTabs()}</Box>
            ) : null}
          </Grid>

          {tabValue === 0 ? (
            <>
              <Grid item md={4} sm={5} xs={12}>
                <Box className="left-section">
                  <Box className="resource-tabs-wrapper">{renderTabs()}</Box>
                  <Box>
                    <Typography variant="h6" className="resources-label">
                      FAQ Categories
                    </Typography>
                  </Box>
                  <Box>
                    <CategoriesList
                      data={data?.data || []}
                      loading={isLoading}
                      handleAddKeyCategory={handleAddKeyCategory}
                      handleCategoryClick={handleCategoryClick}
                      selectedCategory={selectedCategory}
                      handleDelete={handleDeleteCategory}
                      handleEditCategory={handleEditCategory}
                      canUpdate={canUpdate}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item md={8} sm={7} xs={12}>
                <Box
                  className={`right-section ${
                    isMatch ? "sticky-specialization" : ""
                  } common-box-shadow`}
                >
                  <Box className="center-align-items justify-space-between search-box-container">
                    <SearchBox
                      setSearchText={setSearchText}
                      searchText={searchText}
                      setPageNumber={() => {}}
                      setAllDataFetched={() => {}}
                      searchIconClassName="search-icon"
                      className="resources-searchbox"
                      searchBoxColor={"info"}
                    />
                    {canUpdate ? (
                      <IconButton
                        onClick={handleAddFAQ}
                        className="add-icon-btn"
                      >
                        <AddIcon className="add-icon" />
                      </IconButton>
                    ) : null}
                  </Box>
                  <Box>
                    {questionsList?.length ? (
                      <FAQList
                        questionsList={questionsList}
                        onEditClick={handleEditQueClick}
                        onDeleteClick={handleDeleteQueClick}
                        loading={questionLoading}
                        canUpdate={canUpdate}
                      />
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          minHeight: "25vh",
                          alignItems: "center",
                        }}
                        data-testid="not-found-animation-container"
                      >
                        <BaseNotFoundLottieLoader
                          height={250}
                          width={250}
                        ></BaseNotFoundLottieLoader>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Grid>
            </>
          ) : null}
          {tabValue === 1 && (
            <Box sx={{ width: "100%" }}>
              <UpdateResource
                state={state}
                firstEnterPageLoading={firstEnterPageLoading}
                setFirstEnterPageLoading={setFirstEnterPageLoading}
                getAllUpdateAPIcall={getAllUpdateAPIcall}
                setGetAllUpdateAPIcall={setGetAllUpdateAPIcall}
                allResourceContent={allResourceContent}
                setAllResourceContent={setAllResourceContent}
                tabValue={tabValue}
              ></UpdateResource>
            </Box>
          )}
          {tabValue === 2 && (
            <Box sx={{ width: "100%" }}>
              <Script collegeId={collegeId} canUpdate={canUpdate}></Script>
            </Box>
          )}
        </Grid>
      </Container>
      <ManageCourseDialog
        open={openDialog}
        onClose={handleDialogClose}
        title={isEditCategory ? "Edit Category" : "FAQ Category"}
        className="resource-course-dialog"
      >
        <CreateSegregationForm
          data={isEditCategory ? editTagData : {}}
          isEditMode={isEditCategory}
          onCancel={handleCancel}
          onSubmit={handleAddTagSubmit}
          loading={loading}
        />
      </ManageCourseDialog>
      {sendMessageDialogOpen && (
        <SendResourceDialog
          sendMessageDialogOpen={sendMessageDialogOpen}
          handleSendMessageDialogClose={handleSendMessageDialogClose}
          setFirstEnterPageLoading={setFirstEnterPageLoading}
          setGetAllUpdateAPIcall={setGetAllUpdateAPIcall}
          setAllResourceContent={setAllResourceContent}
        ></SendResourceDialog>
      )}
      <ManageCourseDialog
        open={openFAQPopUp}
        onClose={handleDialogFAQClose}
        title={isEditQuestionMode ? "Edit Question" : "Create Question"}
        className="resource-create-question-dialog"
      >
        <CreateQuestionForm
          tagList={
            data?.data?.map((item) => ({
              label: item.category_name,
              value: item.category_name,
            })) || []
          }
          isEditQuestionMode={isEditQuestionMode}
          data={isEditQuestionMode ? editQuestionData : null}
          onCancel={handleCancelBtn}
          onSubmit={handleSaveQue}
          loading={loading}
        />
      </ManageCourseDialog>

      <ConfirmationDialog
        title="Confirm"
        message={
          <Typography component="p">
            Are you sure, you want to delete the{" "}
            {deleteTagIndex !== null ? "tag" : "question"}?
          </Typography>
        }
        handleClose={() => {
          setDeleteTagIndex(null);
          setOpenConfirmationDialog(false);
        }}
        handleOk={() => handleConfirmation()}
        open={openConfirmationDialog}
        loading={loading}
      />
    </Box>
  );
};

export default Resources;
