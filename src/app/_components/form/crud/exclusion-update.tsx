import * as React from "react";
import { PersonSelector } from "@/app/_components/list/person-selector";
import { type PairingExtended } from "@/app/events/[id]/pairing/[pairing_id]/page";
import { updateExclusion } from "@/app/actions/update-exclusion";
import { toast } from "@/app/_components/ui/use-toast";
import { fetchExclusionByGiverId } from "@/lib/supabase";

type ExclusionUpdateProps = {
  pairing: PairingExtended;
  pairings: PairingExtended[];
  disabled?: boolean;
};

export async function ExclusionList({
  pairing,
  pairings,
  disabled,
}: ExclusionUpdateProps) {
  const { event_id, giver } = pairing;
  const { data: exclusions } = await fetchExclusionByGiverId(
    pairing?.event_id,
    pairing.giver_id,
  );
  const exclusionList = exclusions?.map((exclusion) => exclusion.person_b_id);

  async function handleUpdate(list: string[], isBidirectional?: boolean) {
    "use server";
    if (!event_id || !giver?.id) return false;
    const updateList = await updateExclusion(
      event_id,
      giver.id,
      list,
      //isBidirectional,
    );
    if (updateList) {
      toast({
        variant: "informative",
        title: `La liste d'exclusion a été mise à jour !`,
      });
      return true;
    }
    toast({
      variant: "destructive",
      title: `Un problème est survenu`,
    });
    return false;
  }

  return (
    <>
      <PersonSelector
        people={pairings.map(({ giver }) => {
          return giver!;
        })}
        exclude={pairings
          .filter(({ giver: p }) => p?.id === giver?.id)
          .map(({ giver: g }) => g!)}
        initial={exclusionList}
        action={handleUpdate}
        disabled={disabled}
      />
    </>
  );
}
