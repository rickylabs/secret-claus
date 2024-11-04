"use client";
import * as React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import Image from "next/image";
import { getAvatarFile, getInitials } from "@/lib/utils";

interface SantaAvatarProps {
  name: string;
  id: string;
}

export function SantaAvatar({ name, id }: SantaAvatarProps) {
  const avatarFile = getAvatarFile(id);

  return (
    <Avatar className={"h-10 w-10 md:h-14 md:w-14"}>
      <AvatarImage asChild src="/avatar_1.png">
        <Image src={avatarFile} alt="avatar" width={56} height={56} />
      </AvatarImage>
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}
