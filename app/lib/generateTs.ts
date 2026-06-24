import { detectType } from "./detectType";

export function generateTs(
  fields: string[]
) {
  let output =
    "export interface Data {\n";

  fields.forEach((field) => {
    const type = detectType(field);

    const tsType =
      type === "date"
        ? "string"
        : type;

    output += `  ${field}: ${tsType};\n`;
  });

  output += "}";

  return output;
}