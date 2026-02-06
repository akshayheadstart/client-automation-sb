import React from "react";
import classnames from "classnames";
import { usePagination, DOTS } from "../../../hooks/usePagination";
import "../../../styles/Pagination.scss";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { InputNumber, Popover, Whisper } from "rsuite";
import { useState } from "react";
import useToasterHook from "../../../hooks/useToasterHook";
import { Box } from "@mui/material";
import TableDataCount from "../../ui/application-manager/TableDataCount";
const Pagination = (props) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className,
    count,
  } = props;
  const [userInputPage, setUserInputPage] = useState(NaN);

  const [showPaginationInfo, setShowPaginationInfo] = useState(false);

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  const pushNotification = useToasterHook();
  const handleGoToCustomPage = () => {
    if (userInputPage < 1 || userInputPage > count) {
      pushNotification(
        "warning",
        `Page number should be greater than 0 and less than ${count}`
      );
      return;
    }
    onPageChange(parseInt(userInputPage));
  };
  const speaker = (
    <Popover style={{ width: "120px", zIndex: 2000 }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isNaN(userInputPage)) {
            return;
          } else {
            handleGoToCustomPage();
          }
        }}
      >
        <InputNumber
          required
          min={1}
          max={count}
          placeholder="Go To"
          onChange={(value) => {
            if (value?.length) {
              setUserInputPage(value);
            } else {
              setUserInputPage(NaN);
            }
          }}
        />
      </form>
    </Popover>
  );

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange
    ? paginationRange[paginationRange?.length - 1]
    : 1;

  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
      }}
    >
      <ul
        style={{ alignSelf: "end" }}
        onMouseEnter={() => setShowPaginationInfo(true)}
        onMouseLeave={() => setShowPaginationInfo(false)}
        className={classnames("all-pagination-container", {
          [className]: className,
        })}
      >
        <li
          className={classnames("pagination-item", {
            disabled: currentPage === 1,
          })}
          onClick={onPrevious}
        >
          <NavigateBeforeIcon sx={{ color: "blue", fontSize: "1rem" }} />
        </li>
        {paginationRange?.map((pageNumber) => {
          if (pageNumber === DOTS) {
            return (
              <Whisper
                style={{ zIndex: "2000" }}
                placement="top"
                controlId="control-id-click"
                trigger="click"
                speaker={speaker}
                onClose={() => {
                  if (isNaN(userInputPage)) {
                    return;
                  } else {
                    handleGoToCustomPage();
                  }
                }}
              >
                <li className="pagination-item dots">&#8230;</li>
              </Whisper>
            );
          }

          return (
            <li
              className={classnames("pagination-item", {
                selected: pageNumber === currentPage,
              })}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </li>
          );
        })}
        <li
          className={classnames("pagination-item", {
            disabled: currentPage === lastPage,
          })}
          onClick={onNext}
        >
          <NavigateNextIcon sx={{ color: "blue", fontSize: "1rem" }} />
        </li>
      </ul>
    </Box>
  );
};

export default Pagination;
