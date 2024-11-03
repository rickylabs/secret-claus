import * as React from "react";
import { useState, useCallback, useRef } from "react";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { type AsYouType, getAsYouType } from "awesome-phonenumber";
import { getCountryList } from "./service";
import {
  type CountryOption,
  type PhoneFieldProps,
} from "@/app/_components/form/fields/phone-field/helpers";
import { SearchCountry } from "@/app/_components/form/fields/phone-field/search-country";

const PhoneField = ({
  control,
  name,
  label,
  placeholder = "Phone number",
  description,
  defaultCountry = "US",
  onValidate,
  onCountryChange,
  onSave,
}: PhoneFieldProps) => {
  console.log(control);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const [formattedNumber, setFormattedNumber] = useState(
    (control._defaultValues.phone_number?.number as string) ?? "",
  );
  const [isValid, setIsValid] = useState(true);
  const formatter = useRef<AsYouType>(getAsYouType(defaultCountry));
  const countries = getCountryList();
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(
    countries.find((c) => c.value === defaultCountry)!,
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const trimmedInput = formattedNumber.trim();

    if ((event.key === "Enter" || event.key === " ") && trimmedInput) {
      event.preventDefault();
      const parsedNumber = validateAndFormatPhone(trimmedInput);
      if (parsedNumber) {
        setFormattedNumber("");
        onSave && onSave(parsedNumber);
      }
    }
  };

  // Handlers
  function validateAndFormatPhone(
    input: string,
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
  ) {
    if (!/^[+\d\s]*$/.test(input)) return;

    formatter.current.reset(input);
    const formatted = formatter.current.number();
    setFormattedNumber(formatted);

    const parsedNumber = formatter.current.getPhoneNumber();
    const isValidNumber = parsedNumber.valid;
    setIsValid(isValidNumber);
    if (isValidNumber && onValidate) {
      onValidate(parsedNumber.number.e164);
      return parsedNumber.number.e164;
    }
    return false;
  }

  const handleCountryChange = useCallback(
    (newCountryCode: string) => {
      const newCountry = countries.find((c) => c.value === newCountryCode);
      if (!newCountry) return;
      formatter.current = getAsYouType(newCountry.value);
      setSelectedCountry(newCountry);
      setFormattedNumber("");
      setIsValid(true);
      onCountryChange?.(newCountryCode);
    },
    [countries],
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-2">
          {label && <FormLabel className={"text-red-500"}>{label}</FormLabel>}
          <div className="flex gap-2">
            <SearchCountry
              countries={countries}
              defaultCountry={selectedCountry?.value ?? defaultCountry}
              onSelected={handleCountryChange}
            />
            <Input
              {...field}
              value={formattedNumber}
              onChange={(e) => {
                const input = e.target.value;
                validateAndFormatPhone(input);
                !onSave &&
                  field.onChange({
                    ...e,
                    target: {
                      ...e.target,
                      value: {
                        number: formatter.current.getPhoneNumber().number?.e164,
                        country: selectedCountry.value,
                      },
                    },
                  });
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              type="tel"
              className={`flex-1 ${
                !isValid && formattedNumber ? "border-red-500" : ""
              }`}
            />
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          {!isValid && formattedNumber && (
            <FormMessage>
              Please enter a valid phone number for {selectedCountry.label}
            </FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};

export default PhoneField;
