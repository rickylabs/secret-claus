"use client";
import React from "react";
import { type Tables } from "@/types/supabase";
import { MultiSelect } from "@/app/_components/ui/multi-select";
import { OctagonMinus } from "lucide-react";
import { useRouter } from "next/navigation";

type PersonSelectorProps = {
  people: Tables<"person">[];
  exclude?: Tables<"person">[];
  action?: (list: string[]) => Promise<boolean>;
  initial?: string[];
  disabled?: boolean;
};

export function PersonSelector({
  people,
  exclude,
  initial,
  action,
  disabled,
}: PersonSelectorProps) {
  const router = useRouter();

  return (
    <MultiSelect
      placeholder={
        <div className={"flex items-center space-x-2"}>
          <span className="md:text mr-2 hidden text-sm md:block">{`Exclure des invités`}</span>
          <OctagonMinus className="!ml-0 h-4 w-4" />
        </div>
      }
      options={people.map((person) => {
        return {
          label: person?.name ?? "",
          value: person?.id ?? "",
          disabled: !!exclude?.find((p) => p?.id === person?.id),
        };
      })}
      onChange={async (list) => {
        if (action) {
          const validate = await action(list);
          if (!validate) return;
          router.refresh();
        }
      }}
      selected={initial ?? []}
      disabled={people.length === 0 || disabled}
    />
  );
}
