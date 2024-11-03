import * as React from "react";
import { type HTMLInputTypeAttribute } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import IconButton from "@/app/_components/ui/icon-button";
import { Eye, EyeOff } from "lucide-react";
import { type DefaultFieldProps } from "@/app/_components/form/fields/input-field";

type PasswordFieldProps = DefaultFieldProps & {
  type?: HTMLInputTypeAttribute;
};
const PasswordField = ({
  control,
  name,
  label,
  placeholder,
  description,
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <>
            <FormItem>
              {label && (
                <FormLabel className={"text-red-500"}>{label}</FormLabel>
              )}
              <div className="flex flex-row gap-1">
                <FormControl>
                  <Input
                    placeholder={placeholder}
                    {...field}
                    type={showPassword ? "text" : "password"}
                  />
                </FormControl>
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  variant={"outline"}
                  className="border-md flex w-10 justify-center border-green-100 p-1 text-green-600 text-white shadow-none hover:border-none hover:bg-green-800 hover:text-inherit hover:shadow-md md:w-20"
                  startIcon={showPassword ? <EyeOff /> : <Eye />}
                />
              </div>
              {description && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </FormItem>
          </>
        )}
      />
    </>
  );
};

export default PasswordField;
