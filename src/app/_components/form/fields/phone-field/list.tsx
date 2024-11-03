// list.tsx
import React, { useMemo } from "react";
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

interface CountryListProps {
  selectedValue: string;
  onSelect: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export const CountryList = ({
  selectedValue,
  onSelect,
  searchQuery,
  setSearchQuery,
}: CountryListProps) => {
  const filteredCountries = useMemo<CountryOption[]>(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    return searchCountries(searchQuery);
  }, [searchQuery]);

  /*return (
        <>
            <Input
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9"
            />
            <ScrollArea className="h-[300px]">
                <div>
                    {filteredCountries.map((country) => (
                        <Button
                            key={country.value}
                            value={country.value}
                            onSelect={() => onSelect(country.value)}
                            className="flex cursor-pointer items-center gap-2"
                            data-selected={country.value === selectedValue}
                        >
                            <span>{country.flag}</span>
                            <span className="flex-1 truncate">{country.label}</span>
                            <span className="text-muted-foreground">{country.dialCode}</span>
                        </Button>
                    ))}
                </div>
            </ScrollArea>
        </>

    )*/

  return (
    <Command className="w-full">
      <CommandInput
        placeholder="Search countries..."
        value={searchQuery}
        onValueChange={setSearchQuery}
        className="h-9"
      />
      <CommandList>
        <CommandEmpty className="py-2 text-center text-sm">
          No countries found.
        </CommandEmpty>
        <CommandGroup>
          {filteredCountries.map((country) => {
            console.log(country.value, "country");
            return (
              <CommandItem
                key={country.value}
                value={country.value}
                onSelect={(e) => {
                  console.log(e, "e");
                  console.log(country.value, "country.value");
                  onSelect(country.value);
                }}
                className="flex cursor-pointer items-center gap-2"
                data-selected={country.value === selectedValue}
              >
                <span>{country.flag}</span>
                <span className="flex-1 truncate">{country.label}</span>
                <span className="text-muted-foreground">
                  {country.dialCode}
                </span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

CountryList.displayName = "CountryList";
