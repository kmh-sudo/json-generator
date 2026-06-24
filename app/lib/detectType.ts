export type FieldType =
  | "string"
  | "number"
  | "boolean"
  | "date";

export function detectType(
  field: string
): FieldType {
  const f = field.toLowerCase();
  const normalized = f.replace(/[^a-z0-9]/g, "");
  const tokens = field
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  const hasTimestampSuffix =
    /At$/.test(field) ||
    /[_\-.]at$/i.test(field);

  if (
    tokens.includes("date") ||
    normalized.includes("createdat") ||
    normalized.includes("updatedat") ||
    hasTimestampSuffix
  ) {
    return "date";
  }

  if (
    normalized.startsWith("is") ||
    normalized.startsWith("has") ||
    normalized.includes("enabled") ||
    normalized.includes("verified") ||
    normalized.includes("published") ||
    normalized.includes("active")
  ) {
    return "boolean";
  }

  if (
    tokens.includes("age") ||
    tokens.includes("count") ||
    tokens.includes("price") ||
    tokens.includes("rate") ||
    tokens.includes("amount") ||
    tokens.includes("quantity") ||
    normalized === "number"
  ) {
    return "number";
  }

  return "string";
}
