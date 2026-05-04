import { createMultiParser, type SingleParser } from "nuqs";

type SerializableSingleParser<ItemType> = Required<
  Pick<SingleParser<ItemType>, "parse" | "serialize">
>;

function splitDelimitedValue(value: string, separator: string) {
  return value.split(separator).filter(Boolean);
}

function areArraysEqual(a: unknown, b: unknown) {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    return false;
  }

  return (
    a.length === b.length && a.every((item, index) => Object.is(item, b[index]))
  );
}

export function parseAsNativeOrDelimitedArrayOf<ItemType>(
  itemParser: SerializableSingleParser<ItemType>,
  separator = ",",
) {
  // TanStack Router turns typed array search params into arrays, while older
  // nuqs URLs used a single delimited value. Accept both, write native arrays.
  return createMultiParser<ItemType[]>({
    parse: (values) => {
      const rawValues =
        values.length === 1
          ? splitDelimitedValue(values[0], separator)
          : values.filter(Boolean);
      const parsedValues = rawValues.map((value) => itemParser.parse(value));

      if (parsedValues.some((value) => value === null)) {
        return null;
      }

      return parsedValues as ItemType[];
    },
    serialize: (values) => {
      if (Array.isArray(values)) {
        return values.map((value) => itemParser.serialize(value));
      }

      return splitDelimitedValue(String(values), separator);
    },
    eq: areArraysEqual,
  }).withDefault([]);
}
