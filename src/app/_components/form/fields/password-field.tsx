import * as React from "react";
import {type HTMLInputTypeAttribute} from "react";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/app/_components/ui/form";
import {Input} from "@/app/_components/ui/input";
import IconButton from "@/app/_components/ui/icon-button";
import {Eye, EyeOff} from "lucide-react";
import {type DefaultFieldProps} from "@/app/_components/form/fields/input-field";

type PasswordFieldProps = DefaultFieldProps & {
    type?: HTMLInputTypeAttribute
}
const PasswordField = ({control, name, label, placeholder, description}: PasswordFieldProps) => {
    const [showPassword, setShowPassword] = React.useState<boolean>(false);

    return (
        <>
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <>
                        <FormItem>
                            {label && <FormLabel className={"text-red-500"}>{label}</FormLabel>}
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
                                    className="hover:bg-green-800 text-white p-1 flex justify-center text-green-600 w-10 md:w-20 hover:text-inherit border-md border-green-100 hover:border-none shadow-none hover:shadow-md"
                                    startIcon={showPassword ? <EyeOff /> : <Eye />}
                                />
                            </div>
                            {description &&
                                <FormDescription>
                                    {description}
                                </FormDescription>
                            }
                            <FormMessage/>
                        </FormItem>
                    </>

                )}
            />
        </>

  )
}

export default PasswordField