import { Button } from "@/app/_components/ui/button";
import React from "react";

type ButtonProps = {
  onClick: () => void;
  variant?:
    | "default"
    | "link"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  className: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  text?: string;
};

const IconButton: React.FC<ButtonProps> = ({
  onClick,
  variant,
  className,
  startIcon,
  endIcon,
  text,
}) => {
  return (
    <Button
      type={"button"}
      onClick={onClick}
      variant={variant}
      className={className}
    >
      {startIcon && <span className={text ? "mr-2" : ""}>{startIcon}</span>}
      {text && <span className="hidden md:block">{text}</span>}
      {endIcon && <span className={text ? "ml-2" : ""}>{endIcon}</span>}
    </Button>
  );
};

export default IconButton;
