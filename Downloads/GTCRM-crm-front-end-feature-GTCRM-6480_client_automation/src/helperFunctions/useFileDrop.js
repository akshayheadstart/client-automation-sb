import { useRef } from "react";

const useFileDrop = (
  maxSizeMB,
  pushNotification,
  handleFunction,
  collegeId
) => {

  const inputRef = useRef(null);

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;

    if (files.length === 0) return;

    const fileSize = files[0].size;
    const totalFileSize = fileSize / (1024 * 1024); // Convert file size to MB

    if (totalFileSize > maxSizeMB) {
      // Clear the file input (optional)
      inputRef.current.value = null;
      pushNotification(
        "error",
        `File size exceeds ${maxSizeMB}MB. Please select a smaller file.`
      );
      return;
    }
    handleFunction(collegeId, files[0]);
  };

  const setRef = (ref) => {
    inputRef.current = ref;
  };

  return { handleDrop, setRef };
};

export default useFileDrop;
