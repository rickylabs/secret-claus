"use client";
import * as React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import Image from "next/image";

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length && words[0]) {
    if (words.length === 1) {
      return words[0] ? words[0].substring(0, 2).toUpperCase() : "";
    } else {
      const second = words[words.length - 1]?.charAt(0);
      return words[0].charAt(0).toUpperCase() + second?.toUpperCase();
    }
  }
  return "";
}

interface SantaAvatarProps {
    name: string
    id: string
}

function hashCode(s: string) {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
        hash = Math.imul(31, hash) + s.charCodeAt(i) | 0;
    }
    return hash;
}

function getAvatarFile(id: string) {
    const hash = hashCode(id);
    const index = Math.abs(hash % 20) + 1; // Get a number between 1 and 20
    return `/avatar_${index}.png`;
}

export function SantaAvatar({name, id}: SantaAvatarProps) {
    const avatarFile = getAvatarFile(id);

    return (
        <Avatar className={"h-14 w-14"}>
            <AvatarImage asChild src='/avatar_1.png'>
                <Image src={avatarFile} alt='avatar' width={56} height={56} />
            </AvatarImage>
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
    )
}

