import * as React from "react";
import {type HTMLInputTypeAttribute} from "react";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/app/_components/ui/form";
import {type Control, type FieldName, type FieldValues, type RegisterOptions} from "react-hook-form";
import {Input} from "@/app/_components/ui/input";

export interface DefaultFieldProps {
    control: Control,
    name: FieldName<FieldValues>
    label?: string
    placeholder?: string
    description?: string
    message?: string
    options?: RegisterOptions
}

type InputFieldProps = DefaultFieldProps & {
    type?: HTMLInputTypeAttribute
}

const InputField = ({control, name, label, placeholder, description, type, options}: InputFieldProps) => {
    return (
      <FormField
          control={control}
          name={name}
          render={({ field }) => (
              <>
                  <FormItem>
                      {label && <FormLabel className={"text-red-500"}>{label}</FormLabel>}
                      <FormControl>
                          <Input
                              type={type ?? "text"}
                              placeholder={placeholder}
                              {...field}
                          />
                      </FormControl>
                      {description ?
                          <FormDescription>
                              {description}
                          </FormDescription> : <p className={"hidden"}></p>
                      }
                      <FormMessage/>
                  </FormItem>
              </>

          )}
      />
  )
}

export default InputField