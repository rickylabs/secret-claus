import React from "react";

interface IntroStepProps {
  icon: React.ReactNode;
  title: string;
  description: string | React.ReactNode;
}
export const IntroStep = ({ icon, title, description }: IntroStepProps) => {
  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <div className="flex flex-shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white/10 p-5">
        {icon}
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        <div className="mt-2 text-red-100">{description}</div>
      </div>
    </div>
  );
};
