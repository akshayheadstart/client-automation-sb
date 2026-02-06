import { TableCell, tableCellClasses } from "@mui/material";
import { styled } from "@mui/material/styles";
const useTableCellDesign = () => {
  const StyledTableCell = styled(TableCell)(
    ({ borderColor, bodyCellPadding = "10px 18px !important" }) => ({
      [`&.${tableCellClasses.head}`]: {
        backgroundColor: "white",
        color: "#7E92A2",
        fontSize: 16,
        fontWeight: 500,
        borderColor: borderColor ? borderColor : "#E6E8F0",
      },
      [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        fontWeight: 400,
        borderColor: borderColor ? borderColor : "#E6E8F0",
        color: "#092c4c",
        padding: bodyCellPadding,
      },
    })
  );
  return StyledTableCell;
};

export default useTableCellDesign;
