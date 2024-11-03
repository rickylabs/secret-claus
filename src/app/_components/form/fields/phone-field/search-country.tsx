// list.tsx
import React, { useMemo, useState } from "react";
import { searchCountries } from "./service";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/_components/ui/command";
import { type CountryOption } from "./helpers";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import { Button } from "@/app/_components/ui/button";
import { ChevronDown } from "lucide-react";

interface CountryListProps {
  countries: CountryOption[];
  defaultCountry: string;
  onSelected: (value: string) => void;
  onSearch?: (value: string) => void;
}

export const SearchCountry = ({
  countries,
  onSelected,
  defaultCountry,
}: CountryListProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const filteredCountries = useMemo<CountryOption[]>(() => {
    if (!value || value.length < 2) return []; //we do not fallback to country list because it's too expensive
    return searchCountries(value);
  }, [value]);

  const currentCountry = useMemo<CountryOption>(() => {
    return countries.find((c) => c.value === defaultCountry)!;
  }, [countries, defaultCountry]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="text-gray-500">
          <span className="pr-1">{currentCountry.flag}</span>
          <span className="text-muted-foreground pr-1">
            {currentCountry.dialCode}
          </span>
          <ChevronDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search tasks..."
            onValueChange={(value) => setValue(value)}
          />
          <CommandList>
            {filteredCountries.length === 0 ? (
              <CommandEmpty>
                Vous pouvez rechercher un pays un indicatif ou un code national
              </CommandEmpty>
            ) : (
              <CommandEmpty>No tasks found.</CommandEmpty>
            )}
            <CommandGroup>
              {filteredCountries.map((country) => (
                <CommandItem
                  key={country.value}
                  onSelect={() => {
                    setValue(country.value);
                    onSelected(country.value);
                    setOpen(false);
                  }}
                >
                  <span>{country.flag}</span>
                  <span className="flex-1 truncate">{country.label}</span>
                  <span className="text-muted-foreground">
                    {country.dialCode}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
