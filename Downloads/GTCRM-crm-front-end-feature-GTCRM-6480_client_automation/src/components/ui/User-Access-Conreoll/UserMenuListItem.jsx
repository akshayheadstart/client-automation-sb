/* eslint-disable array-callback-return */
import React, { useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  List,
  Typography,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SaveIcon from "@mui/icons-material/Save";
import { LoadingButton } from "@mui/lab";
import "../../../styles/UserMenuListItem.css";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import { useSelector } from "react-redux";
import UserMenuItem from "../../shared/UserMenuListItem/UserMenuItem";
import UserMenuSubItem from "../../shared/UserMenuListItem/UserMenuSubItem";

const UserMenuListItem = ({
  nodeDatum,
  allPermission,
  loading,
  isFetching,
  somethingWentWrong,
  internalServerError,
  featuresListData,
  setAllPermission = () => {},
  saveUserPermissionsBulk = () => {},
}) => {
  const [userPermissionData, setUserPermissionData] = React.useState(
    allPermission[nodeDatum?.menu]?.menus
  );

  const updatePermissionTable = () => {
    saveUserPermissionsBulk();
  };

  useEffect(() => {
    setAllPermission(userPermissionData, nodeDatum);
  }, [userPermissionData, setAllPermission]);

  const handleOnChange = (feature, field, newFeature) => {
    setUserPermissionData((prevState) => {
      const newMenuValue = newFeature
        ? prevState?.[feature][field].menu
        : !prevState?.[feature][field].menu;
      const updatedFeatures = {};

      if (!newMenuValue) {
        Object.keys(prevState?.[feature][field]?.features).forEach((key) => {
          updatedFeatures[key] = false;
        });
      } else if (newFeature) {
        if (prevState?.[feature][field]?.features?.[newFeature] !== undefined) {
          return {
            ...prevState,
            [feature]: {
              ...prevState?.[feature],
              [field]: {
                ...prevState?.[feature][field],
                menu: newMenuValue,
                features: {
                  ...prevState?.[feature][field]?.features,
                  [newFeature]:
                    !prevState?.[feature][field]?.features?.[newFeature],
                },
              },
            },
          };
        }
      } else {
        Object.keys(prevState?.[feature][field]?.features).forEach((key) => {
          updatedFeatures[key] = prevState?.[feature][field]?.features[key];
        });
      }

      return {
        ...prevState,
        [feature]: {
          ...prevState?.[feature],
          [field]: {
            ...prevState?.[feature][field],
            menu: newMenuValue,
            features: updatedFeatures,
          },
        },
      };
    });
  };

  const [isCheckedIndex, setIsCheckedIndex] = React.useState();
  const [isCheckedBoolean, setIsCheckedBoolean] = React.useState(false);
  let mappingObjectData = Object.keys(allPermission[nodeDatum.menu]?.menus).map(
    (data) => data
  );
  let mappingObject = mappingObjectData.slice(0, -1);

  return (
    <>
      {internalServerError || somethingWentWrong ? (
        <Box
          className="error-animation-box"
          data-testid="error-animation-container"
        >
          {internalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <>
          {isFetching ? (
            <Box
              sx={{
                width: "100%",
                minHeight: "50vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LeefLottieAnimationLoader
                height={120}
                width={120}
              ></LeefLottieAnimationLoader>
            </Box>
          ) : (
            <List sx={{ width: "100%", maxWidth: 360, p: 1 }}>
              {mappingObject?.map((feature, index) => {
                return (
                  <Accordion
                    key={index}
                    sx={{ mb: 1 }}
                    className="faqs-accord-individual"
                  >
                    <AccordionSummary
                      onClick={() => {
                        setIsCheckedIndex(index);
                        setIsCheckedBoolean(!isCheckedBoolean);
                      }}
                      expandIcon={
                        <AddOutlinedIcon className="faqs-accord-icon" />
                      }
                      aria-controls="panel1a-content"
                      id="faqs-accord-individual-question"
                    >
                      <Typography
                        className={
                          isCheckedIndex === index && isCheckedBoolean
                            ? "faqs-accord-individual-question-text-active"
                            : "faqs-accord-individual-question-text"
                        }
                      >
                        {feature}
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      <Typography className="faqs-accord-individual-question-text">
                        {Object.keys(
                          allPermission[nodeDatum.menu]?.menus?.[feature]
                        ).map((featureSub) => {
                          return (
                            <>
                              <UserMenuItem
                                feature={feature}
                                featureSub={featureSub}
                                userPermissionData={userPermissionData}
                                handleOnChange={handleOnChange}
                              ></UserMenuItem>
                              {userPermissionData?.[feature]?.[featureSub]
                                ?.menu ? (
                                <>
                                  {Object.keys(
                                    allPermission[nodeDatum.menu]?.menus?.[
                                      feature
                                    ]?.[featureSub]?.features
                                  ).map((featureSubFeature) => {
                                    if (
                                      featuresListData?.[feature]?.[
                                        featureSub
                                      ]?.[featureSubFeature]
                                    ) {
                                      return (
                                        <UserMenuSubItem
                                          feature={feature}
                                          featureSub={featureSub}
                                          userPermissionData={
                                            userPermissionData
                                          }
                                          handleOnChange={handleOnChange}
                                          featureSubFeature={featureSubFeature}
                                        ></UserMenuSubItem>
                                      );
                                    }
                                  })}
                                </>
                              ) : (
                                ""
                              )}
                            </>
                          );
                        })}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
              <Box
                sx={{ display: "flex", justifyContent: "center", my: 3, mx: 1 }}
              >
                <LoadingButton
                  size="small"
                  color="secondary"
                  onClick={updatePermissionTable}
                  loading={loading}
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="outlined"
                >
                  {" "}
                  Save
                </LoadingButton>
              </Box>
            </List>
          )}
        </>
      )}
    </>
  );
};

export default UserMenuListItem;
