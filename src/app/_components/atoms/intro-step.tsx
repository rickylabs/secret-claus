import React from "react";

interface IntroStepProps {
  icon: React.ReactNode;
  title: string;
  description: string | React.ReactNode;
}
export const IntroStep = ({icon, title, description}: IntroStepProps) => {
    return (
        <div className="flex flex-col md:flex-row gap-8">
            <div className="flex items-center justify-center flex-shrink-0 p-5 rounded-lg bg-white/10 border border-gray-300">
                {icon}
            </div>
            <div>
                <h2 className="text-2xl font-semibold text-white">{title}</h2>
                <div className="mt-2 text-red-100">
                    {description}
                </div>
            </div>
        </div>
    );
}