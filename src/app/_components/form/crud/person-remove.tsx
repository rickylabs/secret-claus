"use client";
import * as React from "react";
import { Button } from "@/app/_components/ui/button";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Form } from "@/app/_components/ui/form";
import { Loader2, UserMinus } from "lucide-react";
import { removePerson } from "@/app/actions/remove-person";
import { toast } from "@/app/_components/ui/use-toast";

export function PersonRemoval({
  eventId,
  personId,
  name,
  disabled
}: {
  eventId: string;
  personId: string;
  name?: string;
  disabled?: boolean;
}) {
  const form = useForm();
  const {
    formState: { isLoading, isSubmitting },
  } = form;
  const router = useRouter();

  return (
    <>
      <Form {...form}>
        <form
          /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          action={form.handleSubmit(async () => {
            try {
              // Call the function to remove the person
              await removePerson(eventId, personId);
              router.refresh();
              toast({
                variant: "informative",
                title: name
                  ? `${name} a été supprimé de la liste des invités.`
                  : "invité supprimé avec succès.",
              });
            } catch (e) {
              console.error(e);
            }
          })}
        >
          <div className="grid w-full items-center justify-center gap-4">
            <Button
              disabled={isLoading || isSubmitting || disabled}
              type="submit"
              variant="outline"
              className="border-md flex w-10 justify-center border-red-100 bg-red-600 p-1 text-white shadow-none hover:border-none hover:bg-red-800 hover:text-inherit hover:shadow-md md:w-48"
            >
              {!isLoading && !isSubmitting ? (
                <>
                  <span className="mr-2 hidden md:block">{`Retirer le participant`}</span>
                  <UserMinus className="h-4 w-4" />
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