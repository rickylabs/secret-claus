import * as React from "react";
import { X } from "lucide-react";
import { Input } from "@/app/_components/ui/input";
import { Badge } from "@/app/_components/ui/badge";
import { cn } from "@/lib/utils";

// Base MultiEmailInput Component
interface MultiEmailInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const MultiEmailInput = ({
  value,
  onChange,
  placeholder = "Enter email addresses...",
  className,
  disabled,
}: MultiEmailInputProps) => {
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    const trimmedInput = inputValue.trim();

    if ((event.key === "Enter" || event.key === " ") && trimmedInput) {
      event.preventDefault();
      onChange([...value, trimmedInput]);
      setInputValue("");
    } else if (event.key === "Backspace" && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const removeEmail = (emailToRemove: string) => {
    if (disabled) return;
    onChange(value.filter((email) => email !== emailToRemove));
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "min-h-10 border-input bg-background ring-offset-background focus-within:ring-ring flex w-full flex-wrap items-center gap-1.5 rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2",
        className,
        disabled && "cursor-not-allowed opacity-50",
      )}
      onClick={handleContainerClick}
    >
      {value.map((email, index) => (
        <Badge
          key={`${email}-${index}`}
          variant="secondary"
          className="gap-1 pr-1"
        >
          {email}
          <button
            type="button"
            className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
            onClick={(e) => {
              e.stopPropagation();
              removeEmail(email);
            }}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Input
        ref={inputRef}
        type="email"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="placeholder:text-muted-foreground flex-1 border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder={value.length === 0 ? placeholder : ""}
        disabled={disabled}
      />
    </div>
  );
};

export default MultiEmailInput;
