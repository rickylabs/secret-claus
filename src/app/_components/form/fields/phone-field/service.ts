// service.ts
import {
  getCountryCodeForRegionCode,
  getSupportedRegionCodes,
} from "awesome-phonenumber";
import { type CountryOption, getFlag } from "./helpers";

let countryList: CountryOption[] | null = null;

const normalizeSearch = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export const getCountryList = (): CountryOption[] => {
  if (countryList) return countryList;

  const formatter = new Intl.DisplayNames(["en"], { type: "region" });

  countryList = getSupportedRegionCodes()
    .map((code) => {
      const label = formatter.of(code) ?? code;
      const countryCode = getCountryCodeForRegionCode(code);
      const dialCode = `+${countryCode}`;

      // Normalize the country name for searching
      const normalizedLabel = normalizeSearch(label);

      return {
        value: code,
        label,
        dialCode,
        flag: getFlag(code),
        searchTerms: {
          original: `${label} ${code} ${dialCode}`,
          normalized: `${normalizedLabel} ${code.toLowerCase()} ${countryCode}`,
        },
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  return countryList;
};

export const searchCountries = (query: string): CountryOption[] => {
  if (!query || query.length < 2) return [];

  const normalizedQuery = normalizeSearch(query);
  const isDialCode = /^\+?\d+$/.test(query);
  const cleanQuery = query.replace(/^\+/, ""); // Remove leading + for dial code comparison

  return getCountryList()
    .filter((country) => {
      if (isDialCode) return country.dialCode.includes(cleanQuery); // Use cleanQuery here
      return country.searchTerms.normalized.includes(normalizedQuery);
    })
    .sort((a, b) => {
      // For dial code search
      if (isDialCode) {
        const cleanDialCodeA = a.dialCode.replace(/^\+/, "");
        const cleanDialCodeB = b.dialCode.replace(/^\+/, "");

        const aExactDialMatch = cleanDialCodeA === cleanQuery;
        const bExactDialMatch = cleanDialCodeB === cleanQuery;

        if (aExactDialMatch && !bExactDialMatch) return -1;
        if (!aExactDialMatch && bExactDialMatch) return 1;

        // If neither or both are exact dial code matches, sort alphabetically
        return a.label.localeCompare(b.label);
      }

      // For country code search
      const aExactMatch = a.value.toLowerCase() === query.toLowerCase();
      const bExactMatch = b.value.toLowerCase() === query.toLowerCase();

      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;

      // If neither or both are exact matches, sort alphabetically
      return a.label.localeCompare(b.label);
    });
};
