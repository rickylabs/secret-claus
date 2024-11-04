"use client";
import * as React from "react";
import { Button } from "@/app/_components/ui/button";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Form } from "@/app/_components/ui/form";
import { Loader2, RadioTower } from "lucide-react";
import { toast } from "@/app/_components/ui/use-toast";
import { type Tables } from "@/types/supabase";
import { type Table } from "@/server/db/supabase";
import { publishEvent } from "@/app/actions/publish-event";

export function PublishEvent({
  event,
  pairings,
}: {
  event: Tables<Table.Event>;
  pairings?: Tables<Table.Pairing>[];
}) {
  const form = useForm();
  const {
    formState: { isLoading, isSubmitting },
  } = form;
  const router = useRouter();
  const areGuestReady =
    !event.guest_signup ||
    pairings?.every((pairing) => pairing.confirmed !== null);

  return (
    <>
      <Form {...form}>
        <form
          /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          action={form.handleSubmit(async () => {
            try {
              // Call the function to remove the person
              await publishEvent(event.id);
              router.refresh();
              toast({
                variant: "informative",
                title: event.title
                  ? `L'évènement "${event.title}" a été publié !`
                  : "une erreur est sruvenue.",
              });
            } catch (e) {
              console.error(e);
              // @ts-expect-error: e.message is not assignable
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              const message = e.message;
              toast({
                variant: "destructive",
                title: "Une erreur est sruvenue.",
                description: `${message ?? ""}`,
              });
            }
          })}
        >
          <div className="grid w-full items-center justify-center gap-4">
            <Button
              disabled={
                isLoading ||
                isSubmitting ||
                event.status === "active" ||
                !areGuestReady
              }
              type="submit"
              variant="outline"
              className="border-md flex w-10 justify-center border-green-100 bg-green-600 p-1 text-white shadow-none hover:border-none hover:bg-green-800 hover:text-inherit hover:shadow-md md:w-48"
            >
              {!isLoading && !isSubmitting ? (
                <>
                  <span className="mr-2 hidden md:block">{`Publier l'évènement`}</span>
                  <RadioTower className="h-4 w-4" />
                </>
              ) : (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
