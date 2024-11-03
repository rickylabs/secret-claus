import * as React from "react";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { type DefaultFieldProps } from "@/app/_components/form/fields/input-field";
import { MultiSelect } from "@/app/_components/ui/multi-select";

interface SelectItemProps {
  item_value: string;
  item_label: string;
  disabled?: boolean | string;
}

// Base interface for common props
interface BaseSelectFieldProps extends DefaultFieldProps {
  items: SelectItemProps[];
  placeholder?: string;
  description?: string;
  label?: string;
  name: string;
}

// Single select specific props
interface SingleSelectFieldProps extends BaseSelectFieldProps {
  isMulti?: false;
  defaultValue?: string;
}

// Multi select specific props
interface MultiSelectFieldProps extends BaseSelectFieldProps {
  isMulti: true;
  defaultValue?: string[];
}

// Union type for all possible select field props
type SelectFieldProps = SingleSelectFieldProps | MultiSelectFieldProps;

const SelectField = ({
  control,
  name,
  label,
  placeholder,
  description,
  items,
  isMulti,
  defaultValue,
}: SelectFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const value = field?.value
          ? typeof field.value === "string"
            ? field.value.split(",")
            : (field.value as string[])
          : (defaultValue as string[]);

        return (
          <FormItem>
            {label && (
              <FormLabel htmlFor={name} className="text-red-500">
                {label}
              </FormLabel>
            )}
            {isMulti ? (
              <MultiSelect
                placeholder={placeholder}
                options={items.map(({ item_value, item_label, disabled }) => {
                  return { value: item_value, label: item_label, disabled };
                })}
                {...field}
                selected={value ?? []}
                onChange={field.onChange}
              />
            ) : (
              <Select
                onValueChange={field.onChange}
                defaultValue={defaultValue}
              >
                <SelectTrigger id={name}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent position="popper">
                  {items.map(({ item_value, item_label, disabled }, index) => (
                    <SelectItem
                      key={index}
                      value={item_value}
                      disabled={!!disabled}
                    >
                      {`${item_label} ${
                        typeof disabled === "string" ? "(" + disabled + ")" : ""
                      }`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default SelectField;
