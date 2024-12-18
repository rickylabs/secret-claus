"use client";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/app/_components/ui/menubar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Table } from "@/server/db/supabase";
import { type Tables } from "@/types/supabase";

interface NavigationProps {
  event?: Tables<Table.Event>;
}

export const Navigation = ({ event }: NavigationProps) => {
  const pathname = usePathname();

  return (
    <div className="flex w-full flex-row items-center justify-center p-4">
      <Menubar>
        <MenubarMenu>
          <Link href={"/"}>
            <MenubarTrigger
              className={`${pathname === "/" ? "font-bold" : ""}`}
            >
              Home
            </MenubarTrigger>
          </Link>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger
            className={`${pathname.includes("/events") ? "font-bold" : ""}`}
          >
            Évènements
          </MenubarTrigger>
          <MenubarContent>
            <Link
              href={"/events"}
              className={`${pathname === "/events" ? "font-bold" : ""}`}
            >
              <MenubarItem>
                Mes évènements <MenubarShortcut>⌘E</MenubarShortcut>
              </MenubarItem>
            </Link>
            <Link
              href={"/events/new"}
              className={`${pathname === "/events/new" ? "font-bold" : ""}`}
            >
              <MenubarItem>
                Nouvel évènement <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
            </Link>
            {event && (
              <>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger
                    className={`${
                      pathname.includes("/events/" + event.id)
                        ? "font-bold"
                        : ""
                    }`}
                  >
                    {event.title}
                  </MenubarSubTrigger>
                  <MenubarSubContent>
                    <Link href={`/events/${event.id}/edit`}>
                      <MenubarItem>Modifier</MenubarItem>
                    </Link>
                    <Link href={`/events/${event.id}/people#list`}>
                      <MenubarItem>Gérer les participants</MenubarItem>
                    </Link>
                    <Link href={`/events/${event.id}/people#add`}>
                      <MenubarItem>Ajouter un participant</MenubarItem>
                    </Link>
                    <Link href={`/events/${event.id}#share`}>
                      <MenubarItem>Partager</MenubarItem>
                    </Link>
                    <MenubarItem disabled>Archiver</MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
              </>
            )}
            <MenubarSeparator />
            <MenubarItem disabled>
              À propos... <MenubarShortcut>⌘I</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Profil</MenubarTrigger>
          <MenubarContent>
            <MenubarItem disabled>Éditer...</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Connexion <MenubarShortcut>⌘L</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};
