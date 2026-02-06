export const scrollToTheElement = (hashId) => {
  if (hashId) {
    const element = document.querySelector(hashId); // Find the element by ID
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" }); // Scroll to the element
    }
  }
};
