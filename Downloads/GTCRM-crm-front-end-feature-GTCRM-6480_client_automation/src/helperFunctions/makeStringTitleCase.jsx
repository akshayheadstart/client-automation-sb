export const toTitleCase = (str) => {
  return str
    ?.toLowerCase()
    ?.split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export const titleWithBreak = (data, index) => {
  if (data?.title) {
    const titleParts = data.title.split(" ");

    if (index === 0) {
      return `${titleParts[0]} ${titleParts[1]}`;
    } else if (index === 3) {
      return (
        <>
          {titleParts[0]} {titleParts[1]} <br />
          {titleParts[2]} {titleParts[3]}
        </>
      );
    } else {
      return (
        <>
          {titleParts[0]} <br /> {titleParts[1]}
        </>
      );
    }
  }

  return null;
};
