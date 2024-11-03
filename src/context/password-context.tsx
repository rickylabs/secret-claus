"use client";
import React, { createContext, useContext, useState } from "react";
import { compareSync } from "bcrypt-ts";

type PasswordContextType = {
  isValid: boolean;
  checkPassword: (password: string, hashedPassword: string) => void;
  reset: () => void;
};

export const PasswordContext = createContext<PasswordContextType | undefined>(
  undefined,
);

export const PasswordProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isValid, setIsValid] = useState(false);

  const checkPassword = (password: string, hashedPassword: string) => {
    setIsValid(compareSync(password, hashedPassword));
  };
  const reset = () => {
    setIsValid(false);
  };

  return (
    <PasswordContext.Provider value={{ isValid, checkPassword, reset }}>
      {children}
    </PasswordContext.Provider>
  );
};

export const usePasswordContext = () => {
  const context = useContext(PasswordContext);
  if (context === undefined) {
    throw new Error(
      "usePasswordContext must be used within a PasswordProvider",
    );
  }
  return context;
};
