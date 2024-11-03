import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function hashCode(s: string) {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (Math.imul(31, hash) + s.charCodeAt(i)) | 0;
  }
  return hash;
}

export function getAvatarFile(id: string) {
  const hash = hashCode(id);
  const index = Math.abs(hash % 20) + 1; // Get a number between 1 and 20
  return `/avatar_${index}.png`;
}

export function getInitials(name: string): string {
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
