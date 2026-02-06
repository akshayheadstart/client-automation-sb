import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Box,
  IconButton,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import NavigationButtons from "./NavigationButtons";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import { useValidateRequestFormCaller } from "../../../hooks/apiCalls/useValidateRequestFormApiCall";
import useToasterHook from "../../../hooks/useToasterHook";
import RenderFormFields from "./RenderFormFields";
import ReorderTab from "./ReorderTab";
import { useSelector } from "react-redux";
import UploadDocumentField from "./UploadDocumentField/UploadDocumentField";

export default function DynamicTabs({
  formFields,
  currentSectionIndex,
  setCurrentSectionIndex,
  isFetchingDefaultForm,
  hideBackBtn,
  collegeId,
  clientId,
  parentTabs,
  approverId,
}) {
  const pushNotification = useToasterHook();
  const [templateDetails, setTemplateDetails] = useState({});
  const [tableTemplateData, setTableTemplateData] = useState({});
  const [openAddTemplateDialog, setOpenAddTemplateDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingField, setEditingField] = useState(null);

  // Initialize parentTabsData with numerical keys (0, 1, 2...)
  const initialParentTabsData = parentTabs?.reduce((acc, _, index) => {
    acc[index] = [];
    return acc;
  }, {});

  const [parentTabsData, setParentTabsData] = useState(initialParentTabsData);
  const [activeParentTab, setActiveParentTab] = useState(0); // Now using index
  const [activeChildTab, setActiveChildTab] = useState("");
  const [newTabCount, setNewTabCount] = useState(3);

  const userId = useSelector((state) => state.authentication.token?.user_id);

  // Helper function to get current parent tab name
  const getParentTabName = (index) => {
    return parentTabs?.[index] || "";
  };

  useEffect(() => {
    if (formFields) {
      const initializeParentTabs = () => {
        if (
          !parentTabsData ||
          typeof parentTabsData !== "object" ||
          Array.isArray(parentTabsData)
        ) {
          return;
        }

        const updatedData = {};

        // Initialize with numerical indices
        parentTabs?.forEach((_, index) => {
          updatedData[index] = [];
        });

        formFields.forEach((stage, index) => {
          const processedStage = {
            id: (index + 1).toString(),
            step_name: stage?.step_name,
            is_locked: stage?.is_locked,
            step_details: stage?.step_details,
            not_draggable: stage?.not_draggable,
            sections: stage?.sections?.map((section) => ({
              ...section,
              isEditing: false,
            })),
            isEditing: false,
            gtm_details: {
              gtm_event_key_name: stage?.gtm_event_key_name || "",
              gtm_id: stage?.gtm_id || "",
            },
            no_sections: stage?.no_sections || false,
          };

          // Add to each available tab using numerical index
          Object.keys(updatedData).forEach((tabKey) => {
            updatedData[tabKey].push({ ...processedStage });
          });
        });

        setParentTabsData(updatedData);

        // Set initial active child tab for the first parent tab
        if (updatedData[0]?.length > 0) {
          setActiveChildTab(updatedData[0][0]?.id || "");
        }
      };

      initializeParentTabs();
      setNewTabCount(formFields?.length + 1);
    }
  }, [formFields]);

  const addTab = () => {
    const newTab = {
      id: newTabCount.toString(),
      step_name: `New Tab ${newTabCount}`,
      is_locked: false,
      sections: [
        {
          section_title: "Title",
          section_subtitle: "Sub Title",
          fields: [],
        },
      ],
      isEditing: false,
    };

    setParentTabsData((prev) => ({
      ...prev,
      [activeParentTab]: [
        ...prev[activeParentTab].slice(0, -1),
        newTab,
        prev[activeParentTab][prev[activeParentTab].length - 1],
      ],
    }));

    setNewTabCount(newTabCount + 1);
    setActiveChildTab(newTab.id);
  };

  const removeTab = (tabId) => {
    setParentTabsData((prev) => {
      const newTabs = prev[activeParentTab].filter((tab) => tab.id !== tabId);
      return {
        ...prev,
        [activeParentTab]: newTabs,
      };
    });

    if (activeChildTab === tabId) {
      setActiveChildTab(parentTabsData[activeParentTab][0]?.id || "");
    }
  };

  const startEditing = (tabId) => {
    setParentTabsData((prev) => ({
      ...prev,
      [activeParentTab]: prev[activeParentTab].map((tab) =>
        tab.id === tabId ? { ...tab, isEditing: true } : tab
      ),
    }));
  };

  const handleEditChange = (tabId, newLabel) => {
    setParentTabsData((prev) => ({
      ...prev,
      [activeParentTab]: prev[activeParentTab].map((tab) =>
        tab.id === tabId ? { ...tab, step_name: newLabel } : tab
      ),
    }));
  };

  const finishEditing = (tabId) => {
    setParentTabsData((prev) => ({
      ...prev,
      [activeParentTab]: prev[activeParentTab].map((tab) =>
        tab.id === tabId ? { ...tab, isEditing: false } : tab
      ),
    }));
  };

  const startEditingSection = (index, field) => {
    setEditingIndex(index);
    setEditingField(field);
  };

  const handleSectionChange = (index, field, value) => {
    setParentTabsData((prev) => ({
      ...prev,
      [activeParentTab]: prev[activeParentTab].map((tab) =>
        tab.id === activeChildTab
          ? {
              ...tab,
              sections: tab.sections.map((section, secIndex) =>
                secIndex === index ? { ...section, [field]: value } : section
              ),
            }
          : tab
      ),
    }));
  };

  const finishEditingSection = () => {
    setEditingIndex(null);
    setEditingField(null);
  };

  const addSection = () => {
    setParentTabsData((prev) => ({
      ...prev,
      [activeParentTab]: prev[activeParentTab].map((tab) =>
        tab.id === activeChildTab
          ? {
              ...tab,
              sections: [
                ...tab.sections,
                {
                  id: `${activeChildTab}-${tab.sections.length}`,
                  section_title: "Title",
                  section_subtitle: "Sub Title",
                  fields: [],
                },
              ],
            }
          : tab
      ),
    }));
  };

  const handleAddTemplate = (template) => {
    setTableTemplateData(template);
    setParentTabsData((prev) => ({
      ...prev,
      [activeParentTab]: prev[activeParentTab].map((tab) =>
        tab.id === activeChildTab
          ? {
              ...tab,
              sections: [...tab.sections, template],
            }
          : tab
      ),
    }));
    setOpenAddTemplateDialog(false);
    setTemplateDetails({});
  };

  const handleDeleteSection = (index) => {
    setParentTabsData((prev) => ({
      ...prev,
      [activeParentTab]: prev[activeParentTab].map((tab) =>
        tab.id === activeChildTab
          ? {
              ...tab,
              sections: tab.sections.filter((_, i) => i !== index),
            }
          : tab
      ),
    }));
  };

  const addFieldToSection = (sectionIndex, newFields) => {
    setParentTabsData((prev) => ({
      ...prev,
      [activeParentTab]: prev[activeParentTab].map((tab) =>
        tab.id === activeChildTab
          ? {
              ...tab,
              sections: tab.sections.map((section, secIndex) => {
                if (secIndex !== sectionIndex) return section;

                return {
                  ...section,
                  fields: newFields,
                };
              }),
            }
          : tab
      ),
    }));
  };

  const handleAddFields = (sectionIndex, newFields) => {
    if (newFields.length === 0) return;
    addFieldToSection(sectionIndex, newFields);
  };

  const handleEditField = (updatedField, editingIndex, sectionIndex) => {
    setParentTabsData((prev) => ({
      ...prev,
      [activeParentTab]: prev[activeParentTab].map((tab) =>
        tab.id === activeChildTab
          ? {
              ...tab,
              sections: tab.sections.map((section, secIndex) => {
                if (secIndex !== sectionIndex) return section;

                const existingFields = section.fields || [];

                if (editingIndex !== null) {
                  const updatedFields = [...existingFields];
                  updatedFields[editingIndex] = updatedField;

                  return {
                    ...section,
                    fields: updatedFields,
                  };
                }
                return section;
              }),
            }
          : tab
      ),
    }));
  };

  const handleDeleteField = (fieldIndexToDelete, sectionIndex) => {
    setParentTabsData((prev) => ({
      ...prev,
      [activeParentTab]: prev[activeParentTab].map((tab) =>
        tab.id === activeChildTab
          ? {
              ...tab,
              sections: tab.sections.map((section, secIndex) => {
                if (secIndex !== sectionIndex) return section;

                return {
                  ...section,
                  fields: section.fields.filter(
                    (_, index) => index !== fieldIndexToDelete
                  ),
                };
              }),
            }
          : tab
      ),
    }));
  };

  const handleBack = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      localStorage.setItem(
        `${userId}createCollegeSectionIndex`,
        (currentSectionIndex - 1).toString()
      );
    }
  };

  const handleNext = () => {
    handleValidateRequest();
  };

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    let sectionIndex;
    const sections = parentTabsData[activeParentTab].find((tab, index) => {
      sectionIndex = index;
      return tab.id === activeChildTab;
    })?.sections;

    if (sections[sectionIndex].is_locked) {
      pushNotification(
        "warning",
        "This section is locked and It can't be reordered!"
      );
      return;
    }

    const [reorderedItem] = sections.splice(result.source.index, 1);
    sections.splice(result.destination.index, 0, reorderedItem);

    setParentTabsData((prev) => ({
      ...prev,
      [activeParentTab]: prev[activeParentTab].map((tab, idx) =>
        idx === sectionIndex
          ? {
              ...tab,
              sections,
            }
          : tab
      ),
    }));
  }

  const { callValidateRequestForm, result: validateRequestResult } =
    useValidateRequestFormCaller();

  const handleValidateRequest = async () => {
    const payload = {
      application_form: parentTabsData[activeParentTab],
    };

    // Use getParentTabName to get the actual tab name
    if (["UG", "PG", "PhD"].includes(getParentTabName(activeParentTab))) {
      payload.category = getParentTabName(activeParentTab);
    } else {
      payload.course_name = getParentTabName(activeParentTab);
    }

    const queries = {
      url: "/master/validate_client_or_college_form_data",
      payload: payload,
      approverId: approverId,
    };

    if (collegeId) {
      queries.collegeId = collegeId;
    } else {
      queries.clientId = clientId ? clientId : !collegeId ? userId : "";
    }

    try {
      const res = await callValidateRequestForm(queries);
      if (res.message) {
        pushNotification("success", res.message);
        if (parentTabs?.length > 0) {
          setActiveParentTab((prev) => {
            const nextTab = prev + 1;

            if (nextTab < parentTabs?.length) {
              return nextTab;
            } else {
              setCurrentSectionIndex((prevIndex) => {
                const nextIndex = prevIndex + 1;
                localStorage.setItem(
                  `${userId}createCollegeSectionIndex`,
                  nextIndex.toString()
                );
                return nextIndex;
              });
            }

            return prev;
          });
        } else {
          setCurrentSectionIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            localStorage.setItem(
              `${userId}createCollegeSectionIndex`,
              nextIndex.toString()
            );
            return nextIndex;
          });
        }
      }
    } catch (error) {
      if (error?.data?.detail === "Could not validate credentials") {
        window.location.reload();
      } else if (error?.data?.detail) {
        pushNotification("error", error?.data?.detail);
      }
    }
  };

  const handleGtmChange = (field, value) => {
    setParentTabsData((prev) => ({
      ...prev,
      [activeParentTab]: prev[activeParentTab].map((tab) =>
        tab.id === activeChildTab
          ? {
              ...tab,
              gtm_details: {
                ...tab.gtm_details,
                [field]: value,
              },
            }
          : tab
      ),
    }));
  };

  const handleParentTabChange = (event, newIndex) => {
    setActiveParentTab(newIndex);
    if (parentTabsData[newIndex]?.length > 0) {
      setActiveChildTab(parentTabsData[newIndex][0]?.id || "");
    }
  };

  const currentChildTabs = parentTabsData[activeParentTab] || [];
  const activeChildTabData = currentChildTabs.find(
    (tab) => tab.id === activeChildTab
  );

  return (
    <Box sx={{ p: 3, bgcolor: "#f5f7fa", borderRadius: 2 }}>
      <Tabs
        className="dynamic-tab-container"
        value={activeParentTab}
        onChange={handleParentTabChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        {parentTabs.map((tab, index) => (
          <Tab key={index} label={tab} value={index} />
        ))}
      </Tabs>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 2,
        }}
      >
        <Typography sx={{ mt: 2 }} variant="h6">
          Application Form - {getParentTabName(activeParentTab)}
        </Typography>

        {currentChildTabs.length > 0 && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={addTab}
            color="info"
            sx={{ borderRadius: 1 }}
          >
            Add Tab
          </Button>
        )}
      </Box>

      {isFetchingDefaultForm ? (
        <Box className="loading-animation">
          <LeefLottieAnimationLoader
            height={120}
            width={120}
          ></LeefLottieAnimationLoader>
        </Box>
      ) : (
        <>
          {currentChildTabs.length > 0 ? (
            <>
              <Box className="dynamic-tab-container">
                <Tabs
                  value={activeChildTab}
                  onChange={(_, newValue) => setActiveChildTab(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    "& .MuiTabs-indicator": {
                      display: "none",
                    },
                  }}
                >
                  {currentChildTabs.map((tab) => (
                    <Tab
                      key={tab.id}
                      label={
                        tab.isEditing ? (
                          <TextField
                            value={tab.step_name}
                            onChange={(e) =>
                              handleEditChange(tab.id, e.target.value)
                            }
                            onBlur={() => finishEditing(tab.id)}
                            size="small"
                            autoFocus
                          />
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              bgcolor:
                                activeChildTab === tab.id
                                  ? "#007bff"
                                  : "#e0e7ff",
                              color:
                                activeChildTab === tab.id ? "#fff" : "#333",
                              borderRadius: 2,
                              px: 2,
                              py: 1,
                              boxShadow: activeChildTab === tab.id ? 2 : 0,
                              transition: "all 0.3s ease-in-out",
                            }}
                          >
                            {tab.step_name}
                            <IconButton
                              size="small"
                              onClick={() => startEditing(tab.id)}
                            >
                              <EditIcon
                                fontSize="small"
                                style={{
                                  color:
                                    activeChildTab === tab.id ? "#fff" : "#000",
                                }}
                              />
                            </IconButton>
                            {!tab?.is_locked && (
                              <IconButton
                                size="small"
                                onClick={() => removeTab(tab.id)}
                              >
                                <Close
                                  fontSize="small"
                                  sx={{
                                    color:
                                      activeChildTab === tab.id
                                        ? "#fff"
                                        : "#333",
                                  }}
                                />
                              </IconButton>
                            )}
                          </Box>
                        )
                      }
                      value={tab.id}
                      sx={{
                        textTransform: "none",
                        fontWeight: "bold",
                        borderRadius: 2,
                        minHeight: "48px",
                        color: activeChildTab === tab.id ? "#fff" : "#333",
                        transition: "background 0.3s",
                      }}
                    />
                  ))}
                </Tabs>
                <ReorderTab
                  tabs={currentChildTabs}
                  setTabs={(newTabs) => {
                    setParentTabsData((prev) => ({
                      ...prev,
                      [activeParentTab]: newTabs,
                    }));
                  }}
                />
              </Box>

              <Box className="client-onboarding-flex-box" sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  id="gtm_event_key_name"
                  name="gtm_event_key_name"
                  label="Enter GTM Event Key Name"
                  color="info"
                  value={
                    activeChildTabData?.gtm_details?.gtm_event_key_name || ""
                  }
                  onChange={(e) =>
                    handleGtmChange("gtm_event_key_name", e.target.value)
                  }
                />
                <TextField
                  fullWidth
                  id="gtm_id"
                  name="gtm_id"
                  label="Enter GTM ID"
                  color="info"
                  value={activeChildTabData?.gtm_details?.gtm_id || ""}
                  onChange={(e) => handleGtmChange("gtm_id", e.target.value)}
                />
              </Box>

              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="section-drag" as="div">
                  {(provided) => (
                    <Box
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      sx={{
                        p: 3,
                        border: "1px solid #ddd",
                        borderRadius: 2,
                        mt: 2,
                        bgcolor: "#fff",
                        boxShadow: 2,
                      }}
                    >
                      {activeChildTabData?.sections ? (
                        <>
                          {activeChildTabData.sections.map((section, index) => (
                            <Draggable
                              key={index}
                              draggableId={`draggable-id-${index}`}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <Box
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    boxShadow:
                                      snapshot.isDragging &&
                                      "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                                  }}
                                  sx={{
                                    mb: 2,
                                    p: 2,
                                    bgcolor: "#f9f9f9",
                                    borderRadius: 1,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Box>
                                      {editingIndex === index &&
                                      editingField === "section_title" ? (
                                        <TextField
                                          value={section.section_title || ""}
                                          onChange={(e) =>
                                            handleSectionChange(
                                              index,
                                              "section_title",
                                              e.target.value
                                            )
                                          }
                                          onBlur={() => finishEditingSection()}
                                          autoFocus
                                          fullWidth
                                        />
                                      ) : (
                                        <Typography
                                          variant="h6"
                                          sx={{
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                          onClick={() =>
                                            startEditingSection(
                                              index,
                                              "section_title"
                                            )
                                          }
                                        >
                                          {section.section_title || "Untitled"}
                                          <IconButton size="small">
                                            <EditIcon fontSize="small" />
                                          </IconButton>
                                        </Typography>
                                      )}

                                      {editingIndex === index &&
                                      editingField === "section_subtitle" ? (
                                        <TextField
                                          value={section.section_subtitle || ""}
                                          onChange={(e) =>
                                            handleSectionChange(
                                              index,
                                              "section_subtitle",
                                              e.target.value
                                            )
                                          }
                                          onBlur={() => finishEditingSection()}
                                          autoFocus
                                          fullWidth
                                        />
                                      ) : (
                                        <Typography
                                          variant="subtitle1"
                                          sx={{
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                          onClick={() =>
                                            startEditingSection(
                                              index,
                                              "section_subtitle"
                                            )
                                          }
                                        >
                                          {section.section_subtitle ||
                                            "No subtitle"}
                                          <IconButton size="small">
                                            <EditIcon fontSize="small" />
                                          </IconButton>
                                        </Typography>
                                      )}
                                    </Box>

                                    {!section?.is_locked && (
                                      <TrashIcon
                                        style={{
                                          color: "#dc2626",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          handleDeleteSection(index)
                                        }
                                      />
                                    )}
                                  </Box>

                                  <RenderFormFields
                                    heading={section.section_title}
                                    fieldDetails={
                                      section?.table ? section : section?.fields
                                    }
                                    setFieldDetails={addFieldToSection}
                                    preview={false}
                                    handleAddFields={handleAddFields}
                                    sectionIndex={index}
                                    handleAddCustomField={handleEditField}
                                    handleDeleteField={handleDeleteField}
                                    openAddTemplateDialog={
                                      openAddTemplateDialog
                                    }
                                    setOpenAddTemplateDialog={
                                      setOpenAddTemplateDialog
                                    }
                                    handleAddTemplate={handleAddTemplate}
                                    templateDetails={templateDetails}
                                    setTemplateDetails={setTemplateDetails}
                                    tableTemplateData={tableTemplateData}
                                    setTableTemplateData={setTableTemplateData}
                                    showTable={section.table ? true : false}
                                    isTemplate={section?.is_template}
                                    collegeId={collegeId}
                                    clientId={clientId}
                                    showActions={true}
                                  />
                                </Box>
                              )}
                            </Draggable>
                          ))}
                        </>
                      ) : (
                        activeChildTabData?.step_details
                      )}

                      {!activeChildTabData?.step_details && (
                        <>
                          {activeChildTabData?.sections && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "end",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={addSection}
                                color="info"
                                sx={{ borderRadius: 1 }}
                              >
                                Add Section
                              </Button>
                              {/* <Button
                                variant="outlined"
                                color="info"
                                onClick={() => {
                                  setOpenAddTemplateDialog(true);
                                }}
                              >
                                <AddIcon sx={{ mr: 2 }} />
                                Add Template
                              </Button> */}
                            </Box>
                          )}
                        </>
                      )}
                    </Box>
                  )}
                </Droppable>
              </DragDropContext>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                minHeight: "30vh",
                alignItems: "center",
              }}
            >
              <BaseNotFoundLottieLoader
                height={250}
                width={250}
              ></BaseNotFoundLottieLoader>
            </Box>
          )}
        </>
      )}
      <UploadDocumentField collegeId={collegeId} clientId={clientId} />
      {/* Navigation Buttons */}
      <NavigationButtons
        currentSectionIndex={currentSectionIndex}
        handleBack={handleBack}
        handleNext={handleNext}
        hideBackBtn={hideBackBtn}
        loading={validateRequestResult.isLoading}
      />
    </Box>
  );
}
