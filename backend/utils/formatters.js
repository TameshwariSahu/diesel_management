const toTitleCase = (value) => {
  if (value === null || value === undefined) return value;

  return String(value)
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b[a-z]/g, char => char.toUpperCase());
};

const normalizeRegNo = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim().replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
};

module.exports = { toTitleCase, normalizeRegNo };
