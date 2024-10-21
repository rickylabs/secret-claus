"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

import { Check, ChevronsUpDown, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/app/_components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import { Badge } from "@/app/_components/ui/badge";

export type OptionType = {
  label: string;
  value: string;
  disabled?: boolean | string;
};

interface MultiSelectProps {
    options: OptionType[];
    selected: string[];
    onChange: (value: string[]) => void;
    placeholder?: string | React.ReactNode;
    className?: string;
    disabled?: boolean;
}

function MultiSelect({ options, selected, onChange, placeholder, className, disabled, ...props }: MultiSelectProps) {

    const [open, setOpen] = React.useState(false)

    const handleUnselect = (item: string) => {
        onChange(selected.filter((i) => i !== item))
    }

    return (
        <Popover open={open} onOpenChange={setOpen} {...props}>
            <PopoverTrigger asChild disabled={disabled}>
                <div
                    aria-expanded={open}
                    className={`flex items-center gap-1 flex-wrap text-gray-500 w-[250px] border-zinc-300 justify-between ${selected.length > 1 ? "h-full" : "h-10"} rounded-md border border-zinc-300 p-2`}
                    onClick={() => setOpen(!open)}
                >
                        {selected?.map((item) => {
                            return (
                              <Badge
                                variant="secondary"
                                key={item}
                                className={"mb-1 mr-1"}
                                onClick={() => handleUnselect(item)}
                              >
                                {
                                  options.find(
                                    (option) => option.value === item,
                                  )?.label
                                }
                                <button
                                  className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleUnselect(item);
                                    }
                                  }}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  onClick={() => handleUnselect(item)}
                                >
                                  <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                                </button>
                              </Badge>
                            );
                        })}
                        <div className={cn("ml-auto mr-auto", selected.length > 0 ? "hidden" : "visible")}>{placeholder ?? "Select"}</div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command className={className}>
                    <CommandInput placeholder="Search ..." />
                    <CommandEmpty>No item found.</CommandEmpty>
                    <CommandGroup className='max-h-64 overflow-auto'>
                        {options.map((option) => (
                            <CommandItem
                                key={option.value}
                                disabled={!!option.disabled}
                                onSelect={() => {
                                    onChange(
                                        selected.includes(option.value)
                                            ? selected.filter((item) => item !== option.value)
                                            : [...selected, option.value]
                                    )
                                    setOpen(true)
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        selected.includes(option.value) ?
                                            "opacity-100" : "opacity-0"
                                    )}
                                />
                                {`${option.label} ${option.disabled ? (typeof option.disabled === "string" ? "(" + option.disabled + ")": "(indisponible)") : ""}`}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export { MultiSelect }