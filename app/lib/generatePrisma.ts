import { detectType } from "./detectType";

export function generatePrisma(
  fields: string[]
) {
  let output = `
model Data {
  id String @id @default(cuid())
`;

  fields.forEach((field) => {
    const type = detectType(field);

    let prismaType = "String";

    if (type === "number")
      prismaType = "Int";

    if (type === "boolean")
      prismaType = "Boolean";

    if (type === "date")
      prismaType = "DateTime";

    output += `  ${field} ${prismaType}\n`;
  });

  output += "}";

  return output;
}