// Form Field Component
import type { DefaultFieldProps } from "@/app/_components/form/fields/input-field";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import * as React from "react";
import MultiEmailInput from "@/app/_components/form/fields/email-field/multi-email";

type MultiEmailFieldProps = DefaultFieldProps & {
  disabled?: boolean;
};

const MultiEmailField = ({
  control,
  name,
  label,
  placeholder,
  description,
  disabled,
  options,
}: MultiEmailFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const value = field?.value
          ? Array.isArray(field.value)
            ? field.value
            : []
          : [];

        return (
          <FormItem>
            {label && <FormLabel className="text-red-500">{label}</FormLabel>}
            <FormControl>
              <MultiEmailInput
                value={value}
                onChange={field.onChange}
                placeholder={placeholder}
                disabled={disabled}
              />
            </FormControl>
            {description ? (
              <FormDescription>{description}</FormDescription>
            ) : (
              <p className="hidden"></p>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default MultiEmailField;
