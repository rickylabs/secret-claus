import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { TRPCReactProvider } from "@/trpc/react";
import { ChristmasSnow } from "@/app/_components/atoms/snowfall";
import { Toaster } from "@/app/_components/ui/toaster";
import { Navigation } from "@/app/_components/layout/navigation";
import { Cookie, type Table } from "@/server/db/supabase";
import { fetchEvent } from "@/lib/supabase";
import { type Tables } from "@/types/supabase";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Secret Claus",
  description: "Get a surprise gift from a random person in your group!",
  icons: [{ rel: "icon", url: "/favicon.png" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const event_cache = cookieStore.get(Cookie.EventId);
  const { data } = await fetchEvent(event_cache?.value);
  const event: Tables<Table.Event> | undefined = data?.[0];

  return (
    <html lang="en">
      <body
        className={`font-sans ${inter.variable} bg-gradient-to-b from-red-950 to-red-800 text-white`}
      >
        <TRPCReactProvider cookies={cookieStore.toString()}>
          <Navigation event={event} />
          <main className="flex min-h-screen flex-col items-center">
            <div className="container relative z-10 flex flex-col items-center justify-center gap-6 md:gap-10 px-2 md:px-4 py-4 md:py-8">
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
                Secret <span className="text-red-300">Claus</span>
              </h1>
              <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-10 lg:w-3/4">
                {children}
              </div>
            </div>
          </main>
          <ChristmasSnow />
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
