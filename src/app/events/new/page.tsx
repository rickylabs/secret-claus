import * as React from "react";
import { EventForm } from "@/app/_components/form/event-form";
import { Card } from "@/app/_components/ui/card";

export default function NewEvent() {
  return (
    <Card className="dark:bg-grey-700/10 w-full space-y-4 rounded-lg border-none bg-white/10 p-2 pb-6 shadow-lg backdrop-blur-sm md:p-8">
      <EventForm />
    </Card>
  );
}
