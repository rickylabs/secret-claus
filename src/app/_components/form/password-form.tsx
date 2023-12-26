'use client'
import React from 'react';
import {type Control, type SubmitHandler, useForm} from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod";
import {type Table, type Tables} from "@/server/db/supabase";
import {z} from "zod";
import {Form} from "@/app/_components/ui/form";
import {toast} from "@/app/_components/ui/use-toast";
import {Button} from "@/app/_components/ui/button";
import PasswordField from "@/app/_components/form/fields/password-field";
import {usePasswordContext} from "@/context/password-context";
import {SantaAvatar} from "@/app/_components/atoms/avatar";
import {type PairingExtended} from "@/app/events/[id]/pairing/[pairing_id]/page";

const passwordFormSchema = z.object({
    password: z.string().min(3),
});

type PasswordFormFields = z.infer<typeof passwordFormSchema>;

type PasswordFormProps = {
    pairing: PairingExtended;
};

export const PasswordForm: React.FC<PasswordFormProps> = ({ pairing }) => {
    const form = useForm<PasswordFormFields>({
        resolver: zodResolver(passwordFormSchema),
    });

    const {
        handleSubmit,
        formState: { isLoading, isSubmitting, isSubmitted },
    } = form;

    const control = form.control as unknown as Control

    const { isValid, checkPassword } = usePasswordContext()

    React.useEffect(() => {
        if(!isValid && isSubmitted){
            toast({
                variant: "destructive",
                title: `Le mot de passe est incorrect.`,
            })
            return;
        }
    }, [isValid, isSubmitted])

    const onSubmit: SubmitHandler<PasswordFormFields> = ({password}) => {
        checkPassword(password, pairing.password);
        return
    }

    if(!pairing.password){
        return <div>Not Found</div>
    }

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="grid w-full gap-4">
                    <PasswordField
                        control={control}
                        name="password"
                        label="Mot de passe"
                        placeholder="Mot de passe"
                        description="Veuillez entrer votre mot de passe pour accéder à votre invité secret."
                    />
                    <Button
                        disabled={isLoading || isSubmitting}
                        variant="outline"
                        className="bg-green-600 hover:bg-green-800 text-white w-52"
                        type="submit"
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export const SecretGuest: React.FC<PasswordFormProps> = ({ pairing }) => {
    const receiver = pairing.receiver
    const { isValid , reset } = usePasswordContext()

    React.useEffect(() => {
        if(isValid){
            toast({
                variant: "informative",
                title: `Le mot de passe est correct.`,
            })
        }
    }, [isValid])

    return (
        <>
            <div className="flex flex-col space-y-1.5">
                {isValid ? (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="text-md italic text-red-950">
                            {`Votre invité secret est:`}
                        </div>
                        <SantaAvatar name={receiver.name ?? "Unknown"} id={receiver.id}/>
                        <b className="text-md text-red-950">{receiver.name}</b>
                        <Button
                            variant="outline"
                            className="bg-green-600 hover:bg-green-800 text-white w-52"
                            onClick={() => reset()}
                        >
                            {`C'est noté !`}
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="text-md italic text-red-950">
                            {`Veuillez entrer votre mot de passe pour accéder à votre invité secret.`}
                        </div>
                        <PasswordForm pairing={pairing}/>
                    </>
                )}
            </div>
        </>
    )
}