// converts StringsLikeThis to Strings Like This
export const beautifyName = (name: string): string =>
  name
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
