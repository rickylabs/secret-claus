import {Button} from "@/app/_components/ui/button";
import Link from "next/link";
import {Card, CardHeader} from "@/app/_components/ui/card";

export const revalidate = 60 //revalidate the data at most: every minute

// eslint-disable-next-line @typescript-eslint/require-await
export default async function Events() {

    return (
        <Card className="backdrop-blur-sm bg-white/10 dark:bg-grey-700/10 p-2 md:p-8 rounded-lg shadow-lg space-y-4 border-none w-full pb-6">
            <CardHeader>
                <div>Mes évènements: </div>
                <div>Veuillez vous connecter afin de pouvoir consulter vos évènements !</div>
            </CardHeader>
            <Link href={"/events/new"}>
                <Button
                    variant={"outline"}
                    className="bg-white/20 hover:bg-red-800 hover:border-none shadow-none hover:shadow-md"
                >
                    Nouvel évènement
                </Button>
            </Link>
        </Card>
    );
}

