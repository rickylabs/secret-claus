import * as React from "react";
import {FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/app/_components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/app/_components/ui/select";
import {type DefaultFieldProps} from "@/app/_components/form/fields/input-field";
import {MultiSelect} from "@/app/_components/ui/multi-select";

interface SelectItemProps {
    item_value: string
    item_label: string
}
type SelectFieldProps = DefaultFieldProps & {
    items: SelectItemProps[]
    isMulti?: boolean
}
const SelectField = ({control, name, label, placeholder, description, items, isMulti}: SelectFieldProps) => {
  return (
      <FormField
          control={control}
          name={name}
          render={({field}) => (
              <FormItem>
                  {label && <FormLabel htmlFor={name} className="text-red-500">{label}</FormLabel>}
                  {isMulti ?
                      <MultiSelect
                          options={items.map(({item_value, item_label}) => {
                              return {value: item_value, label: item_label}
                          })}
                          {...field}
                          selected={field.value as string [] ?? []}
                          onChange={field.onChange}
                      /> :
                      <Select onValueChange={field.onChange}>
                          <SelectTrigger id={name}>
                              <SelectValue placeholder={placeholder}/>
                          </SelectTrigger>
                          <SelectContent position="popper">
                              {items.map(({item_value, item_label}, index) =>
                                  <SelectItem key={index} value={item_value}>{item_label}</SelectItem>
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