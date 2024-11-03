import { type DefaultFieldProps } from "@/app/_components/form/fields/input-field";

export const getFlag = (code: string): string =>
  code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));

// types.ts
export interface CountryOption {
  value: string;
  label: string;
  dialCode: string;
  flag: string;
  searchTerms: {
    original: string;
    normalized: string;
  };
}

export type PhoneFieldProps = DefaultFieldProps & {
  defaultCountry?: string;
  showFlags?: boolean;
  onValidate?: (value: string) => void;
  onCountryChange?: (country: string) => void;
  onSave?: (value: string) => void;
};
