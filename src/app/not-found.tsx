import {Button} from "@/app/_components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {Card, CardContent, CardFooter, CardHeader} from "@/app/_components/ui/card";
import React from "react";


export default function NotFound() {
    return (
        <Card className="backdrop-blur-sm bg-white/10 dark:bg-grey-700/10 p-2 md:p-8 rounded-lg shadow-lg space-y-4 border-none w-full pb-2">
            <CardHeader>
                <div className="flex flex-column space-x-2 items-center justify-center">
                    <h2 className="text-xl font-bold text-center text-white">
                        {`Ho ho ho il semblerait que tu te soit égaré !`}
                    </h2>
                </div>
            </CardHeader>
            <CardContent className="bg-santa-white p-4 rounded-lg space-y-4 text-red-950 flex flex-column space-x-2 items-center justify-center">
                <Image
                    src={"/404.png"}
                    width={500}
                    height={500}
                    alt={"not found"}
                />
            </CardContent>
            <CardFooter className="flex flex-column space-x-2 items-center justify-center pt-2">
                <Link href={"/"}>
                    <Button
                        className="bg-white/20 hover:bg-red-800 hover:border-none shadow-none hover:shadow-md"
                    >
                        Retour en terres connues
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}