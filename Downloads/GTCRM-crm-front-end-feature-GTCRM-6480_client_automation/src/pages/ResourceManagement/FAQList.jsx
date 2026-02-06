import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  List,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "../../icons/delete-icon.svg";
import EditIcon from "../../icons/edit-icon.svg";
import Cookies from "js-cookie";
import "../../styles/FAQList.css";
import CustomTooltip from "../../components/shared/Popover/Tooltip";

const FAQList = ({
  questionsList = [],
  onEditClick = () => {},
  onDeleteClick = () => {},
  loading,
  canUpdate,
}) => {
  const [expanded, setExpanded] = React.useState("");

  const handleAccordionChange = (event, isExpanded, id) => {
    event.preventDefault();
    if (isExpanded) {
      setExpanded(id);
    } else {
      setExpanded("");
    }
  };

  const handleEditBtnClick = (event, item) => {
    event.preventDefault();
    event.stopPropagation();
    onEditClick(item);
  };

  const handleDeleteQueClick = (event, item) => {
    event.preventDefault();
    event.stopPropagation();
    onDeleteClick(item);
  };
  useEffect(()=>{
      localStorage.setItem(
    `${Cookies.get("userId")}updateResourcesIndex`,
    JSON.stringify(0))
   },[])
  const renderTagsCapsule = (tags = []) => {
    return (
      <Box className="center-align-items-tag">
        {tags.map((item) => (
          <Box className="tag-capsule">
            {item?.length > 8 ? (
              <CustomTooltip
                description={
                  <div>
                    {`${item}
                  `}
                  </div>
                }
                component={
                  <Typography className="tag-text" variant="span">
                    {item.slice(0, 8)}
                    <span>...</span>
                  </Typography>
                }
                color={true}
                placement={"right"}
              />
            ) : (
              <Typography className="tag-text" variant="span">
                {item}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    );
  };
  return (
    <List className="faq-list faq-top-border">
      {questionsList.map((item) => {
        return loading ? (
          <Skeleton variant="rectangular" className="category-item-skeleton" />
        ) : (
          <Accordion
            classes={{
              root: "faq-accordion-item",
            }}
            key={item._id}
            onChange={(event, isExpanded) =>
              handleAccordionChange(event, isExpanded, item._id)
            }
            expanded={item._id === expanded}
          >
            <AccordionSummary
              classes={{
                content:
                  "center-align-items justify-space-between accordion-question-summary",
              }}
              expandIcon={null}
            >
              <Box className="tag-and-faq-box-container">
                {item._id === expanded ? null : renderTagsCapsule(item.tags)}
                <Typography className="faq-title">{item.question}</Typography>
              </Box>
              <Box className="center-align-items justify-space-between">
                {canUpdate ? (
                  <IconButton
                    data-testid="editIcon"
                    onClick={(event) => handleEditBtnClick(event, item)}
                    className="edit-btn"
                  >
                    <img src={EditIcon} alt="edit category" />
                  </IconButton>
                ) : null}
                {canUpdate ? (
                  <IconButton
                    data-testid="deleteIcon"
                    onClick={(event) => handleDeleteQueClick(event, item)}
                    className="delete-btn"
                  >
                    <img src={DeleteIcon} alt="delete category" />
                  </IconButton>
                ) : null}
              </Box>
            </AccordionSummary>
            <AccordionDetails className="faq-details-wrapper">
              {item._id === expanded ? renderTagsCapsule(item.tags) : null}
              <Typography className="faq-description">{item.answer}</Typography>
              <Box className="center-align-items justify-space-between">
                <Box className="faq-date">{item.created_at}</Box>
                <Box className="center-align-items">
                  {canUpdate ? (
                    <IconButton
                      className="tag-capsule-add plus-capsule"
                      onClick={(event) => handleEditBtnClick(event, item)}
                    >
                      <AddIcon className="plus-icon" />
                    </IconButton>
                  ) : null}
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </List>
  );
};

export default FAQList;
