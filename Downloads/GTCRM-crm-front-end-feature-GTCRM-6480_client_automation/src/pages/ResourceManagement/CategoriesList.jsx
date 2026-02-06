import React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Skeleton,
  IconButton,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "../../icons/edit-icon.svg";
import DeleteIcon from "../../icons/delete-icon.svg";
import "../../styles/Resources.css";

const CategoriesList = ({
  handleAddKeyCategory = () => {},
  handleEditCategory = () => {},
  handleCategoryClick = () => {},
  selectedCategory = [],
  data = [],
  loading,
  canUpdate,
  handleDelete = () => {},
}) => {
  return (
    <List>
      {data.map((item) => {
        return loading ? (
          <Skeleton
            key={item.index}
            variant="rectangular"
            className="category-item-skeleton"
          />
        ) : (
          <ListItem
            secondaryAction={
              <Box className="center-align-items">
                <Box className="category-count-circle">
                  <Typography className="category-count-text" variant="span">
                    {item.total || 0}
                  </Typography>
                </Box>
                <Box className="delete-edit-box">
                  {canUpdate ? <IconButton
                    onClick={() => handleEditCategory(item)}
                    className="edit-btn"
                  >
                    <img src={EditIcon} alt="edit category" />
                  </IconButton>: null}
                  {canUpdate ? <IconButton
                    onClick={() => handleDelete(item)}
                    className="delete-btn"
                  >
                    <img src={DeleteIcon} alt="delete category" />
                  </IconButton> : null}
                </Box>
              </Box>
            }
            key={item.index}
            className={`category-item ${
              selectedCategory.includes(item.category_name) ? "selected" : ""
            } common-box-shadow`}
          >
            <ListItemButton
              className="category-item-button"
              onClick={() => handleCategoryClick(item.category_name)}
            >
              <ListItemText primary={item.category_name} />
            </ListItemButton>
          </ListItem>
        );
      })}
      {loading ? (
        <Skeleton variant="rectangular" className="category-item-skeleton" />
      ) : canUpdate ? (
        <ListItem key={"add_tag"} className={`category-item add-category-item`}>
          <ListItemButton
            className="category-item-button"
            onClick={() => handleAddKeyCategory()}
          >
            <ListItemText
              className="add-btn"
              primary={
                <Box className="center-align-items add-category-text">
                  Add Category <AddIcon className="add-icon" />
                </Box>
              }
            />
          </ListItemButton>
        </ListItem>
      ) : null}
    </List>
  );
};

export default CategoriesList;
