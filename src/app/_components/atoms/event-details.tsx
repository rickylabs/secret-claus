import { Calendar, MessageCircle, ShoppingBag } from "lucide-react";
import { type Table } from "@/server/db/supabase";
import { type Tables } from "@/types/supabase";
import {CardSubTitle} from "@/app/_components/ui/card";

type EventDetailsProps = {
  event: Tables<Table.Event>;
};

export const EventDetails = ({ event }: EventDetailsProps) => {
  const date = new Date(event.event_date).toLocaleString("fr-CH");

  return (
    <>
      <CardSubTitle className="text-xl font-bold text-red-950">{`Détails de l'évènement:`}</CardSubTitle>
      <div className="grid w-full items-center gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2 rounded-md border border-red-950 p-2">
            <div className="text-red-950">
              <Calendar />
            </div>
            <div className="font-bold text-red-950">Date</div>
          </div>
          <div className="text-red-950">
            Votre évènement est prevu le <strong>{date}</strong>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2 rounded-md border border-red-950  p-2">
            <div className="text-red-950">
              <MessageCircle />
            </div>
            <div className="font-bold text-red-950">Message</div>
          </div>
          <div className="text-red-950 italic">{event.message}</div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2 rounded-md border border-red-950  p-2">
            <div className="text-red-950">
              <ShoppingBag />
            </div>
            <div className="font-bold text-red-950">Budget</div>
          </div>
          <div className="text-red-950">
            {`Le budget de votre évènement est de `}
            <strong>
              {event.gift_amount.toLocaleString("fr-CH", {
                style: "currency",
                currency: "CHF",
              })}
            </strong>
          </div>
        </div>
      </div>
    </>
  );
};
