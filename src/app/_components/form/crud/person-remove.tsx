"use client"
import * as React from "react";
import {Button} from "@/app/_components/ui/button"
import {useForm} from "react-hook-form";
import {useRouter} from "next/navigation"
import {Form} from "@/app/_components/ui/form";
import {Loader2, UserMinus} from "lucide-react";
import {removePerson} from "@/app/actions/remove-person";
import {toast} from "@/app/_components/ui/use-toast";

export function PersonRemoval({ personId, name }: { personId: string, name?: string }) {
    const form = useForm();
    const {
        formState: { isLoading , isSubmitting},
    } = form
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
                            const payload = await removePerson(personId);
                            router.refresh()
                            toast({
                                variant: "informative",
                                title: name ? `${name} a été supprimé de la liste des invités.` : 'invité supprimé avec succès.',
                            })
                        } catch (e) {
                            console.error(e);
                        }
                    })}
                >
                    <div className="grid w-full justify-center items-center gap-4" >
                        <Button
                            disabled={isLoading || isSubmitting}
                            type="submit"
                            variant="outline"
                            className="bg-red-600 hover:bg-red-800 p-1 flex justify-center text-white w-10 md:w-48 hover:text-inherit border-md border-red-100 hover:border-none shadow-none hover:shadow-md"
                        >
                            {!isLoading && !isSubmitting ?
                                <>
                                    <span className="mr-2 hidden md:block">{`Retirer le participant`}</span>
                                    <UserMinus className="h-4 w-4"/>
                                </> :
                                <Loader2 className="h-4 w-4 animate-spin"/>}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    )
}