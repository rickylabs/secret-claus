import { Button } from "@/app/_components/ui/button";
import Link from "next/link";
import { Card, CardHeader } from "@/app/_components/ui/card";

export const revalidate = 60; //revalidate the data at most: every minute

// eslint-disable-next-line @typescript-eslint/require-await
export default async function Events() {
  return (
    <Card className="dark:bg-grey-700/10 w-full space-y-4 rounded-lg border-none bg-white/10 p-2 pb-6 shadow-lg backdrop-blur-sm md:p-8">
      <CardHeader>
        <div>Mes évènements:</div>
        <div>
          Veuillez vous connecter afin de pouvoir consulter vos évènements !
        </div>
      </CardHeader>
      <Link href={"/events/new"}>
        <Button
          variant={"outline"}
          className="bg-white/20 shadow-none hover:border-none hover:bg-red-800 hover:shadow-md"
        >
          Nouvel évènement
        </Button>
      </Link>
    </Card>
  );
}
