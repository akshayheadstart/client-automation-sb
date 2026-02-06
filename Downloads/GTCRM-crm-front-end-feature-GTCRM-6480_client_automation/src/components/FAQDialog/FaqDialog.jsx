import React, { useState } from "react";
import Button from "@mui/material/Button";
import "../../styles/documentLocker.css";
import CloseIcon from "@mui/icons-material/Close";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import "../../styles/faqDrawer.css";
import arrowIcon from "../../images/faqArrow.svg";
import SearchIcon from "@mui/icons-material/Search";
import LeefLottieAnimationLoader from "../shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../shared/Loader/BaseNotFoundLottieLoader";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import "../../styles/sharedStyles.css";
import MinimizeIcon from "@mui/icons-material/Minimize";
const FaqDialog = ({
  handleFAQClose,
  isFetching,
  getKeyCategoriesData,
  somethingWentWrongInGetKeyCategories,
  getKeyCategoriesInternalServerError,
  apiResponseChangeMessage,
  setSelectedTags,
  setSearchText,
  searchText,
  somethingWentWrongInGetQuestions,
  getQuestionsInternalServerError,
  questionsList,
  isFetchingGetQuestion,
  faqMiniToggle,
  handleFaqMiniDialog,
  handleAddTag,
}) => {
  const [selectedButton, setSelectedButton] = useState(null);
  const handleSelectedTagButton = (index) => {
    if (selectedButton === index) {
      setSelectedButton(null);
    } else {
      setSelectedButton(index);
    }
  };
  return (
    <Box className="faq-drawer-container-box">
      <Box className="faq-drawer-box-top">
        <Typography className="faq-drawer-headline-text">FAQs</Typography>
        <Box className="faq-drawer-close-minimize-box">
          {faqMiniToggle && (
            <MinimizeIcon
              onClick={() => {
                handleFaqMiniDialog();
                handleFAQClose();
              }}
              className="faq-drawer-close-minimize-icon"
            />
          )}
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={() => handleFAQClose()}
          />
        </Box>
      </Box>
      {somethingWentWrongInGetKeyCategories ||
      getKeyCategoriesInternalServerError ||
      somethingWentWrongInGetQuestions ||
      getQuestionsInternalServerError ? (
        <>
          {(getKeyCategoriesInternalServerError ||
            getQuestionsInternalServerError) && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {(somethingWentWrongInGetKeyCategories ||
            somethingWentWrongInGetQuestions) && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </>
      ) : (
        <Box className="faq-drawer-content-box">
          <TextField
            placeholder="Search"
            size="small"
            color="info"
            sx={{
              width: {
                xs: "100%",
                sm: "100%",
                // lg: searchBoxWidth,
              },
            }}
            value={searchText}
            className="faq-drawer-search-field"
            onChange={(event) => {
              setSearchText(event.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  {searchText?.length > 0 ? (
                    <CloseIcon
                      className="search-box-close-icon"
                      onClick={() => {
                        setSearchText("");
                      }}
                    />
                  ) : (
                    <SearchIcon className="search-box-search-icon" />
                  )}
                </InputAdornment>
              ),
            }}
          ></TextField>
          {isFetching ? (
            <Box sx={{ display: "grid", placeItems: "center", my: 2 }}>
              <LeefLottieAnimationLoader
                height={60}
                width={80}
              ></LeefLottieAnimationLoader>
            </Box>
          ) : (
            <>
              {getKeyCategoriesData.length > 0 ? (
                <Box
                  className="faq-drawer-button-box vertical-scrollbar"
                  sx={{ maxHeight: "130px", overflowY: "scroll" }}
                >
                  {getKeyCategoriesData?.map((item, index) => {
                    return (
                      <Button
                        key={index}
                        onClick={() => {
                          handleSelectedTagButton(index);
                          handleAddTag(item?.category_name);
                        }}
                        color="info"
                        className={
                          selectedButton === index
                            ? "faq-drawer-button-text-active"
                            : "faq-drawer-button-text"
                        }
                        variant={
                          selectedButton === index ? "contained" : "outlined"
                        }
                      >
                        {item?.category_name}
                      </Button>
                    );
                  })}
                </Box>
              ) : (
                <Box
                  className="faq-drawer-base-not-found"
                  data-testid="not-found-animation-container"
                >
                  <BaseNotFoundLottieLoader
                    height={70}
                    width={70}
                  ></BaseNotFoundLottieLoader>
                </Box>
              )}
            </>
          )}
          <Box>
            <Divider />
            {isFetchingGetQuestion ? (
              <Box sx={{ display: "grid", placeItems: "center", my: 2 }}>
                <LeefLottieAnimationLoader
                  height={80}
                  width={80}
                ></LeefLottieAnimationLoader>
              </Box>
            ) : (
              <>
                {questionsList?.length > 0 ? (
                  <Box className="faq-drawer-question-box vertical-scrollbar">
                    {questionsList?.map((point, index) => {
                      return (
                        <>
                          <Accordion sx={{ boxShadow: 0 }} key={index}>
                            <AccordionSummary
                              expandIcon={
                                <img src={arrowIcon} alt="arrowIcon" />
                              }
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                            >
                              <Typography className="faq-drawer-question-text">
                                {point?.question}
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Typography className="faq-drawer-question-answer-text">
                                {point?.answer}
                              </Typography>
                              <Typography className="faq-drawer-question-answer-text-date">
                                {point?.created_at}
                              </Typography>
                            </AccordionDetails>
                          </Accordion>
                          <Divider />
                        </>
                      );
                    })}
                  </Box>
                ) : (
                  <Box
                    className="faq-drawer-base-not-found"
                    data-testid="not-found-animation-container"
                  >
                    <BaseNotFoundLottieLoader
                      height={210}
                      width={210}
                    ></BaseNotFoundLottieLoader>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      )}
      <Box className="faq-drawer-close-button-box">
        <Button
          className="faq-drawer-close-button"
          sx={{ borderRadius: 50 }}
          variant="contained"
          color="info"
          onClick={() => handleFAQClose()}
        >
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default FaqDialog;
