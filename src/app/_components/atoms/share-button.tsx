"use client";
import React from "react";
import { Button } from "@/app/_components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "@/app/_components/ui/use-toast";

type ShareButtonProps = {
  link?: string | null | undefined;
  title?: string;
  description?: string;
  isExternal?: boolean;
  customIcon?: React.ReactNode;
  disabled?: boolean;
};
const ShareButton = ({
  link,
  title,
  description,
  isExternal,
  disabled,
}: ShareButtonProps) => {
  //ToDO: create redirect for /blog/topic/[article] to /blog/article

  const handleShare = () => {
    const seoDescription = document
      .querySelector("meta[property='og:description']")
      ?.getAttribute("content");
    const url = isExternal
      ? link ?? ""
      : `${window.location.protocol}//${window.location.host}${link ?? ""}`;
    if (navigator.share) {
      navigator
        .share({
          title: title ?? document.title ?? "Kooko",
          text:
            description ??
            seoDescription ??
            "Kooko - Se régaler le coeur léger !",
          url: url,
        })
        .then(() => {
          toast({
            variant: "informative",
            title: "Lien partagé !",
            //description: "",
          });
        })
        .catch((error) => {
          console.error(error);
          toast({
            variant: "destructive",
            title: "Le lien n'as pas pu être partagé.",
            description:
              "Ceci peut être dû à une incompatibilité avec votre navigateur.",
          });
        });
    } else {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          toast({
            variant: "informative",
            title: "Lien copié dans le presse-papier !",
            //description: "",
          });
        })
        .catch((error) => {
          console.error(error);
          toast({
            variant: "destructive",
            title: "Le lien n'as pas pu être copié.",
            description:
              "Ceci peut être dû à une incompatibilité avec votre navigateur.",
          });
        });
    }
  };

  return (
    <>
      <Button
        onClick={() => {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          });
          handleShare();
        }}
        disabled={!!disabled}
        variant="default"
        className="border-md flex w-10 justify-center bg-green-600 p-1 text-green-100 shadow-none hover:border-none hover:bg-green-800 hover:text-inherit hover:shadow-md md:w-20"
      >
        <span className="mr-2 hidden md:block">Inviter</span>
        <Share2 className="h-4 w-4" />
      </Button>
    </>
  );
};

export default ShareButton;
