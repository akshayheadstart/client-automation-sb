import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import "../../styles/colorThemesForm.css";
import {
  allColorObject,
  colorThemesObject,
} from "../../constants/LeadStageList";
import SharedTextFieldColorTheme from "./SharedTextFieldColorTheme";
import { useSelector } from "react-redux";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import useToasterHook from "../../hooks/useToasterHook";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import {
  transformColorObject,
  updateThemeColors,
} from "../StudentTotalQueries/helperFunction";
import NavigationButtons from "../../components/ui/client-onboarding/NavigationButtons";
import {
  useGetColorThemesDataQuery,
  useUpdateColorThemesMutation,
} from "../../Redux/Slices/clientOnboardingSlice";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
const ColorThemesForm = ({
  currentSectionIndex,
  setCurrentSectionIndex,
  hideNextBtn,
  hideBackBtn,
  userId,
  collegeId,
  approverId,
  viewCollegeDialogOpen,
  defaultColor,
}) => {
  const [loadingSaveColorForm, setLoadingSaveColorForm] = useState(false);
  const pushNotification = useToasterHook();
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [somethingWentWrongInColorThemes, setSomethingWentWrongInColorThemes] =
    useState(false);
  const [colorThemesInternalServerError, setColorThemesServerError] =
    useState(false);
  // Initializing all color values into state
  const [colors, setColors] = useState({});
  const [themeInfo, setThemeInfo] = useState({});
  const [colorObject, setColorObject] = useState({});
  useEffect(() => {
    if (Object.keys(themeInfo).length > 0) {
      const updatedColor = updateThemeColors(themeInfo, colorThemesObject);
      setColorObject(updatedColor);
      setColors(() => {
        const initialState = {};
        Object.entries(updatedColor).forEach(([section, values]) => {
          if (Array.isArray(values)) {
            initialState[section] = {};
            values.forEach((item) => {
              initialState[section][item.label] = item.color;
            });
          } else if (typeof values === "object") {
            initialState[section] = {};
            Object.entries(values).forEach(([label, color]) => {
              initialState[section][label] = color;
            });
          } else {
            initialState[section] = values;
          }
        });
        return initialState;
      });
    } else {
      const defaultColor = updateThemeColors(allColorObject, colorThemesObject);
      setColorObject(defaultColor);
      setColors(() => {
        const initialState = {};
        Object.entries(defaultColor).forEach(([section, values]) => {
          if (Array.isArray(values)) {
            initialState[section] = {};
            values.forEach((item) => {
              initialState[section][item.label] = item.color;
            });
          } else if (typeof values === "object") {
            initialState[section] = {};
            Object.entries(values).forEach(([label, color]) => {
              initialState[section][label] = color;
            });
          } else {
            initialState[section] = values;
          }
        });
        return initialState;
      });
    }
  }, [themeInfo]);
  // Handle color input changes
  const handleColorChange = (section, label, value) => {
    setColors((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [label]: value,
      },
    }));
  };
  const [updateColorThemes] = useUpdateColorThemesMutation();
  // Submit handler
  const handleSaveColorForm = (e) => {
    e.preventDefault();
    setLoadingSaveColorForm(true);
    updateColorThemes({
      approverId,
      collegeId,
      payload: transformColorObject(colors),
    })
      .unwrap()
      .then((res) => {
        try {
          if (res?.message) {
            if (typeof res?.message === "string") {
              pushNotification("success", res?.message);
              if (!hideBackBtn) {
                setCurrentSectionIndex((prev) => {
                  const nextIndex = prev + 1;

                  // Save to localStorage
                  localStorage.setItem(
                    `${userId}createCollegeSectionIndex`,
                    nextIndex.toString()
                  );

                  return nextIndex;
                });
              }
            } else {
              throw new Error("update Color themes API response changed");
            }
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setSomethingWentWrongInColorThemes,
            "",
            5000
          );
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(setColorThemesServerError, "", 10000);
        }
      })
      .finally(() => {
        setLoadingSaveColorForm(false);
      });
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
    handleSaveColorForm();
  };
  //get color theme api
  const [somethingWentWrongGetTheme, setSomethingWentWrongGetTheme] =
    React.useState(false);
  const [getThemeInternalServerError, setGetThemeInternalServerError] =
    useState(false);
  //Get table api call here
  const { data, isSuccess, isError, error, isFetching } =
    useGetColorThemesDataQuery(
      {
        collegeId: collegeId,
      }
      // { skip: viewCollegeDialogOpen ? false : true }
    );
  React.useEffect(() => {
    try {
      if (isSuccess) {
        if (data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data?.color_theme) {
          try {
            if (
              typeof data?.color_theme === "object" &&
              data?.color_theme !== null &&
              !Array.isArray(data?.color_theme)
            ) {
              setThemeInfo(data?.color_theme);
            } else {
              throw new Error("Get theme color API response has changed");
            }
          } catch (error) {}
        } else if (data?.detail) {
          pushNotification("error", data?.detail);
        }
      } else if (isError) {
        if (error?.status === 500) {
          handleInternalServerError(setGetThemeInternalServerError, "", 10000);
        }
      }
    } catch (err) {
      setApiResponseChangeMessage(err);
      handleSomethingWentWrong(setSomethingWentWrongGetTheme, "", 10000);
    }
  }, [data, isSuccess, isError, error, isFetching]);
  return (
    <Box className="color-theme-from-box">
      <Box className="color-theme-from-box-head">
        <Typography className="color-theme-from-text-headline">
          Set Themes Color
        </Typography>
      </Box>
      {isFetching ? (
        <Box
          className="loading-animation-box"
          data-testid="loading-animation-container"
        >
          <LeefLottieAnimationLoader
            height={120}
            width={120}
          ></LeefLottieAnimationLoader>
        </Box>
      ) : (
        <>
          {colorThemesInternalServerError ||
          somethingWentWrongInColorThemes ||
          somethingWentWrongGetTheme ||
          getThemeInternalServerError ? (
            <>
              {(colorThemesInternalServerError ||
                getThemeInternalServerError) && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {(somethingWentWrongInColorThemes ||
                somethingWentWrongGetTheme) && (
                <ErrorFallback
                  error={apiResponseChangeMessage}
                  resetErrorBoundary={() => window.location.reload()}
                />
              )}
            </>
          ) : (
            <form onSubmit={handleSaveColorForm}>
              {Object.entries(colorObject).map(([section, items]) => (
                <React.Fragment key={section}>
                  <Typography className="color-theme-from-text-head">
                    {section?.charAt(0)?.toUpperCase() + section.slice(1)} Color
                  </Typography>
                  <Grid container spacing={2}>
                    {items.map((item) => (
                      <SharedTextFieldColorTheme
                        key={`${section}.${item.label}`}
                        label={item.label}
                        photo={item?.photo}
                        description={item?.description}
                        color={colors?.[section]?.[item.label] || ""}
                        onChange={(e) =>
                          handleColorChange(section, item.label, e.target.value)
                        }
                      />
                    ))}
                  </Grid>
                </React.Fragment>
              ))}
              {
                approverId?
                <Box sx={{ display: "flex", justifyContent:"flex-end", mt:3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="info"
                    onClick={handleNext}
                  >
                    {loadingSaveColorForm ? (
                      <CircularProgress size={20} sx={{color:"white"}} />
                    ) : (
                      "Save"
                    )}
                  </Button>
              </Box>
              :
              <NavigationButtons
                currentSectionIndex={currentSectionIndex}
                handleBack={handleBack}
                handleNext={handleNext}
                loading={loadingSaveColorForm}
                hideBackBtn={hideBackBtn}
                hideNextBtn={hideNextBtn}
              />
              }
              
              
            </form>
          )}
        </>
      )}
    </Box>
  );
};

export default ColorThemesForm;
