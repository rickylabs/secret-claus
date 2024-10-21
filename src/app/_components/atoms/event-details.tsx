import { Calendar, MessageCircle, ShoppingBag } from "lucide-react";
import { type Table, type Tables } from "@/server/db/supabase";

type EventDetailsProps = {
  event: Tables<Table.Event>;
};

export const EventDetails = ({event}:EventDetailsProps) => {
    const date = new Date(event.event_date).toLocaleDateString('fr-CH')

    return (
        <>
            <div className="text-green-900">{`Détails de l'évènement:`}</div>
            <div className="grid w-full items-center gap-5">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-center gap-2 bg-red-100 p-2 rounded-md">
                        <div className="text-red-950"><Calendar/></div>
                        <div className="text-red-950 font-bold">Date</div>
                    </div>
                    <div className="text-red-950">Votre évènement est prevu le {date}</div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-center gap-2 bg-red-100 p-2 rounded-md">
                        <div className="text-red-950"><MessageCircle/></div>
                        <div className="text-red-950 font-bold">Message</div>
                    </div>
                    <div className="text-red-950">{event.message}</div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-center gap-2 bg-red-100 p-2 rounded-md">
                        <div className="text-red-950"><ShoppingBag/></div>
                        <div className="text-red-950 font-bold">Budget</div>
                    </div>
                    <div className="text-red-950">
                        {(event.gift_amount).toLocaleString('fr-CH', {
                            style: 'currency',
                            currency: 'CHF'
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}