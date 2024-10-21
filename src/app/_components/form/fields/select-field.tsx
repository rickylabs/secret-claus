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
type SelectFieldProps = DefaultFieldProps & {
    items: SelectItemProps[]
    isMulti?: boolean
    defaultValue?: string
}
const SelectField = ({control, name, label, placeholder, description, items, isMulti, defaultValue}: SelectFieldProps) => {
  return (
      <FormField
          control={control}
          name={name}
          render={({field}) => (
              <FormItem>
                  {label && <FormLabel htmlFor={name} className="text-red-500">{label}</FormLabel>}
                  {isMulti ?
                      <MultiSelect
                          placeholder={placeholder}
                          options={items.map(({item_value, item_label, disabled}) => {
                              return {value: item_value, label: item_label, disabled}
                          })}
                          {...field}
                          selected={field.value as string [] ?? []}
                          onChange={field.onChange}
                      /> :
                      <Select onValueChange={field.onChange} defaultValue={defaultValue}>
                          <SelectTrigger id={name}>
                              <SelectValue placeholder={placeholder}/>
                          </SelectTrigger>
                          <SelectContent position="popper">
                              {items.map(({item_value, item_label, disabled}, index) =>
                                  <SelectItem key={index} value={item_value} disabled={!!disabled}>
                                      {`${item_label} ${typeof disabled === "string" ? "(" + disabled + ")": ""}`}
                                   </SelectItem>
                              )}
                          </SelectContent>
                      </Select>
                  }
                  {description &&
                      <FormDescription>
                          {description}
                      </FormDescription>
                  }
                  <FormMessage/>
              </FormItem>
          )}
      />
  )
}

export default SelectField