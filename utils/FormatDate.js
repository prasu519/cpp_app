export const FormatDate = (date) => {
  return date
    ? date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-")
    : "";
};
