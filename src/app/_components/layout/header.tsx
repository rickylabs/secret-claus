import React from "react";

type HeaderProps = {
  title: string;
  description: string | React.ReactNode;
};

export const Header: React.FC<HeaderProps> = ({ title, description }) => {
    return (
        <header className="flex flex-col space-y-4 text-center">
            <h2 className="text-xl text-red-300">{title}</h2>
            <p>{description}</p>
        </header>
    );
};