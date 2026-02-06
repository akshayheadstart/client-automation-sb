import Zip from "../icons/Zip.svg";
import Sheets from "../icons/Sheets.svg";
import Pdf from "../icons/pdf.svg";
import Group from "../icons/Group.svg";

export const mediaTypeFilters = [
  { label: "Video", value: "Video" },
  { label: "Image", value: "Image" },
  { label: "File", value: "File" },
];

export const extensionWithIcon = {
  ".zip": Zip,
  ".xlx": Sheets,
  ".xlsx": Sheets,
  ".pdf": Pdf,
  ".xls": Sheets,
  ".doc": Group,
  ".docx": Group,
};
