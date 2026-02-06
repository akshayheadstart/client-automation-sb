async function downloadFiles(urls, pushNotification) {
  for (const url of urls) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const filename = url.split("/").pop();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(link.href);
      pushNotification("success", "Download Successful");
    } catch (error) {
      pushNotification("error", `Failed to download`);
    }
  }
}

export { downloadFiles };
