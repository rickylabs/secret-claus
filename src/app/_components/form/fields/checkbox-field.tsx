import * as React from "react";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/app/_components/ui/form";
import {type DefaultFieldProps} from "@/app/_components/form/fields/input-field";
import {Checkbox} from "@/app/_components/ui/checkbox";

type CheckboxFieldProps = DefaultFieldProps & {
    defaultValue?: boolean
}
const CheckboxField = ({control, name, label, defaultValue, description}: CheckboxFieldProps) => {
  return (
      <FormField
          defaultValue={defaultValue ?? false}
          control={control}
          name={name}
          render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                      <Checkbox
                          checked={field.value as boolean}
                          onCheckedChange={field.onChange}
                      />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                      {label && <FormLabel className={"text-red-500"}>{label}</FormLabel>}
                      {description &&
                          <FormDescription>
                              {description}
                          </FormDescription>
                      }
                      <FormMessage/>
                  </div>
              </FormItem>
              )}
          />
          )
          }

          export default CheckboxField