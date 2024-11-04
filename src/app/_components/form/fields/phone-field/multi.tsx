import * as React from "react";
import { Plus, X } from "lucide-react";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import type { DefaultFieldProps } from "@/app/_components/form/fields/input-field";
import PhoneField from "@/app/_components/form/fields/phone-field";

interface PhoneEntry {
  number: string;
  country: string;
}

// Base interface extending the existing DefaultFieldProps
interface BasePhoneFieldProps extends DefaultFieldProps {
  defaultCountry?: string;
}

// Multi phone specific props
interface MultiPhoneFieldProps extends BasePhoneFieldProps {
  defaultValue?: PhoneEntry[];
}

type EnhancedPhoneFieldProps = MultiPhoneFieldProps;

const MultiPhoneField = ({
  control,
  name,
  label,
  placeholder,
  description,
  defaultCountry = "US",
}: EnhancedPhoneFieldProps) => {
  const [currentNumber, setCurrentNumber] = React.useState("");
  const [currentCountry, setCurrentCountry] = React.useState(defaultCountry);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const handlePhoneAdd = (value: string) => {
          if (value) {
            const currentValue = (field.value as PhoneEntry[]) ?? [];
            field.onChange([
              ...currentValue,
              { number: value ?? currentNumber, country: currentCountry },
            ]);
            setCurrentNumber("");
          }
        };

        const removeNumber = (indexToRemove: number) => {
          const currentValue = (field.value as PhoneEntry[]) ?? [];
          field.onChange(
            currentValue.filter((_, index) => index !== indexToRemove),
          );
        };

        return (
          <FormItem className="space-y-2">
            {label && <FormLabel className="text-red-500">{label}</FormLabel>}
            <FormControl>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <PhoneField
                      control={control}
                      name={`${name}-temp`}
                      placeholder={placeholder}
                      defaultCountry={defaultCountry}
                      onValidate={(value: string) => {
                        setCurrentNumber(value);
                      }}
                      onCountryChange={(country) => {
                        setCurrentCountry(country);
                      }}
                      onSave={(value: string) => handlePhoneAdd(value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handlePhoneAdd(currentNumber)}
                    disabled={!currentNumber}
                  >
                    <Plus size={16} color="green" />
                  </Button>
                </div>

                {((field.value as PhoneEntry[]) ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {(field.value as PhoneEntry[]).map((entry, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="gap-1 pr-1"
                      >
                        {entry.number}
                        <Button
                          type="button"
                          size="xs"
                          onClick={() => removeNumber(index)}
                        >
                          <X size={14} />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export { MultiPhoneField };
