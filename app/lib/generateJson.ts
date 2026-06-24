import { faker } from "@faker-js/faker";
import { detectType, type FieldType } from "./detectType";

type JsonValue =
  | string
  | number
  | boolean
  | JsonObject
  | JsonValue[];

type JsonObject = {
  [key: string]: JsonValue;
};

type FieldSegment = {
  name: string;
  isArray: boolean;
};

export function generateJson(
  fields: string[],
  count = 1
) {
  const recordCount = normalizeCount(count);

  faker.seed(createSeed(fields, recordCount));

  const records = Array.from(
    { length: recordCount },
    () => generateRecord(fields)
  );

  return JSON.stringify(
    recordCount === 1 ? records[0] : records,
    null,
    2
  );
}

function generateRecord(fields: string[]) {
  const obj: JsonObject = {};

  fields.forEach((field) => {
    const segments = parseField(field);

    if (segments.length === 0) return;

    assignValue(obj, segments);
  });

  return obj;
}

function assignValue(
  target: JsonObject,
  segments: FieldSegment[]
) {
  const [segment, ...rest] = segments;

  if (!segment) return;

  if (rest.length === 0) {
    target[segment.name] = segment.isArray
      ? Array.from({ length: 3 }, () =>
          generateValue(singularize(segment.name))
        )
      : generateValue(segment.name);

    return;
  }

  if (segment.isArray) {
    const existing = target[segment.name];
    const items = Array.isArray(existing)
      ? existing
      : Array.from({ length: 3 }, () => ({} as JsonObject));

    items.forEach((item) => {
      if (isJsonObject(item)) {
        assignValue(item, rest);
      }
    });

    target[segment.name] = items;
    return;
  }

  const child = target[segment.name];
  const childObject = isJsonObject(child)
    ? child
    : {};

  assignValue(childObject, rest);
  target[segment.name] = childObject;
}

function generateValue(field: string): JsonValue {
  const type = detectType(field);

  switch (type) {
    case "number":
      return generateNumber(field);

    case "boolean":
      return faker.datatype.boolean();

    case "date":
      return generateDate(field);

    default:
      return generateString(field, type);
  }
}

function generateString(
  field: string,
  type: FieldType
) {
  const key = normalizeField(field);

  if (type !== "string") {
    return faker.lorem.word();
  }

  if (isIdField(field)) {
    return faker.string.uuid();
  }

  if (key === "firstname") {
    return faker.person.firstName();
  }

  if (key === "lastname") {
    return faker.person.lastName();
  }

  if (
    key === "name" ||
    key === "fullname"
  ) {
    return faker.person.fullName();
  }

  if (key.includes("username")) {
    return faker.internet.username();
  }

  if (key.includes("email")) {
    return faker.internet.email();
  }

  if (key.includes("phone")) {
    return faker.phone.number();
  }

  if (
    key.includes("company") ||
    key.includes("business") ||
    key.includes("organization")
  ) {
    return faker.company.name();
  }

  if (key.includes("street")) {
    return faker.location.streetAddress();
  }

  if (key.includes("city")) {
    return faker.location.city();
  }

  if (key.includes("country")) {
    return faker.location.country();
  }

  if (
    key.includes("zip") ||
    key.includes("postalcode")
  ) {
    return faker.location.zipCode();
  }

  if (key.includes("address")) {
    return faker.location.streetAddress({ useFullAddress: true });
  }

  if (
    key.includes("avatar") ||
    key.includes("image")
  ) {
    return faker.image.url();
  }

  if (
    key.includes("url") ||
    key.includes("website")
  ) {
    return faker.internet.url();
  }

  if (key.includes("title")) {
    return faker.person.jobTitle();
  }

  if (key.includes("description")) {
    return faker.lorem.sentence();
  }

  return faker.lorem.words(2);
}

function generateNumber(field: string) {
  const key = normalizeField(field);

  if (key.includes("age")) {
    return faker.number.int({ min: 18, max: 80 });
  }

  if (
    key.includes("price") ||
    key.includes("amount") ||
    key.includes("rate")
  ) {
    return faker.number.float({
      min: 1,
      max: 1000,
      fractionDigits: 2,
    });
  }

  if (
    key.includes("count") ||
    key.includes("quantity")
  ) {
    return faker.number.int({ min: 1, max: 100 });
  }

  return faker.number.int({ min: 1, max: 1000 });
}

function generateDate(field: string) {
  const key = normalizeField(field);

  if (key.includes("birth")) {
    return faker.date
      .birthdate({ min: 18, max: 80, mode: "age" })
      .toISOString();
  }

  if (key.includes("updated")) {
    return faker.date.recent().toISOString();
  }

  if (key.includes("created")) {
    return faker.date.past().toISOString();
  }

  return faker.date.anytime().toISOString();
}

function parseField(field: string): FieldSegment[] {
  return field
    .split(".")
    .map((part) => {
      const trimmed = part.trim();

      return {
        name: trimmed.replace(/\[\]$/g, ""),
        isArray: trimmed.endsWith("[]"),
      };
    })
    .filter((segment) => segment.name.length > 0);
}

function singularize(field: string) {
  if (field.endsWith("ies")) {
    return `${field.slice(0, -3)}y`;
  }

  if (field.endsWith("s")) {
    return field.slice(0, -1);
  }

  return field;
}

function normalizeField(field: string) {
  return field.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isIdField(field: string) {
  const key = normalizeField(field);

  return (
    key === "id" ||
    key === "uuid" ||
    /Id$/.test(field) ||
    /(^|[_\-.])id$/i.test(field)
  );
}

function isJsonObject(
  value: JsonValue | undefined
): value is JsonObject {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function normalizeCount(count: number) {
  if (!Number.isFinite(count)) {
    return 1;
  }

  return Math.max(1, Math.floor(count));
}

function createSeed(
  fields: string[],
  count: number
) {
  return `${fields.join("\n")}\n${count}`.split("").reduce(
    (hash, char) =>
      (Math.imul(31, hash) + char.charCodeAt(0)) >>> 0,
    0
  );
}
