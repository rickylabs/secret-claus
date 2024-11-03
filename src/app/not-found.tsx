import { Button } from "@/app/_components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/app/_components/ui/card";
import React from "react";

export default function NotFound() {
  return (
    <Card className="dark:bg-grey-700/10 w-full space-y-4 rounded-lg border-none bg-white/10 p-2 pb-2 shadow-lg backdrop-blur-sm md:p-8">
      <CardHeader>
        <div className="flex-column flex items-center justify-center space-x-2">
          <h2 className="text-center text-xl font-bold text-white">
            {`Ho ho ho il semblerait que tu te soit égaré !`}
          </h2>
        </div>
      </CardHeader>
      <CardContent className="flex-column flex items-center justify-center space-x-2 space-y-4 rounded-lg bg-santa-white p-4 text-red-950">
        <Image src={"/404.png"} width={500} height={500} alt={"not found"} />
      </CardContent>
      <CardFooter className="flex-column flex items-center justify-center space-x-2 pt-2">
        <Link href={"/"}>
          <Button className="bg-white/20 shadow-none hover:border-none hover:bg-red-800 hover:shadow-md">
            Retour en terres connues
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
