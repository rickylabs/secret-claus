import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  render,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";
import { z } from "zod";
import { MailFooter } from "@/app/novu/emails/_components/footer";
import { selectEventSchema, selectPersonSchema } from "@/server/db/validation";
import { type Tables } from "@/types/supabase";
import { type Table } from "@/server/db/supabase";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

// Default values with type annotation
export const PAIRING_DEFAULTS = {
  event: {
    id: "ddc37c4e-33c5-4fc1-8bd7-f51a61084d24",
    title: "Event Name",
    message: "Event Description",
    event_date: "2022-01-01T00:00:00.000Z",
    gift_amount: 100,
    notification_modes: "link,email",
  } satisfies Partial<Tables<Table.Event>>,
  owner: {
    id: "ddc37c4e-33c5-4fc1-8bd7-f51a61084d24",
    name: "Owner Name",
    email: "pJg9K@example.com",
    phone_number: {
      country_code: "US",
      number: "1234567890",
    },
  } satisfies Partial<Tables<Table.Person>>,
  guest: {
    id: "ddc37c4e-33c5-4fc1-8bd7-f51a61084d24",
    name: "Guest Name",
    email: "pJg9K@example.com",
    phone_number: {
      country_code: "US",
      number: "1234567890",
    },
  } satisfies Partial<Tables<Table.Person>>,
  link: `${baseUrl}/events/unknown`,
};

export const PairingEmailSchema = z.object({
  event: selectEventSchema,
  owner: selectPersonSchema,
  guest: selectPersonSchema,
  link: z.string().url().optional().default(PAIRING_DEFAULTS.link),
  senderIp: z.string().optional(),
  senderLocation: z.string().optional(),
});

type PairingEmailProps = z.infer<typeof PairingEmailSchema>;

const PairingEmail = ({
  event,
  owner,
  guest,
  link,
  senderIp,
  senderLocation,
}: PairingEmailProps) => {
  const previewText = `${guest.name} clique sur le lien pour découvrir ton invité secret !`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-red-800 px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] bg-white p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/favicon.png`}
                height="100"
                alt="Secret Claus"
                className="mx-auto my-0"
              />
            </Section>

            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              <strong>{event.title}: </strong>
              <br />
              {`Découvrez votre ami secret 🎅`}
              {` sur `}
              <strong>Secret Claus</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              {`Ho ho ho 🎄,`} <br />
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>{owner.name ?? ""}</strong>{" "}
              {`Vous êtes invité à découvrir votre invité secret pour l'évènement: `}
              <strong>{event.title}</strong>
            </Text>
            <Text className="text-[14px] italic leading-[24px] text-black">
              {event.message ?? ""}
            </Text>

            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-green-600 px-5 py-3 text-center text-[12px] font-semibold text-white no-underline hover:bg-green-800"
                href={link}
              >
                {`Découvrir mon ami secret`}
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              {`Ou copiez le lien ci-dessous pour révéler votre invité secret: `}
              <Link href={link} className="text-blue-600 no-underline">
                {link}
              </Link>
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <MailFooter />

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This invitation was intended for{" "}
              <span className="text-black">{guest.name ?? guest.email}</span>.
              This notification was sent {owner ? `by ${owner.name} ` : ""} from{" "}
              <span className="text-black">{senderIp}</span> located in{" "}
              <span className="text-black">{senderLocation}</span>. If you were
              not expecting this invitation, you can ignore this email. If you
              are concerned about your account safety, please reply to this
              email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

const renderPairing = (props: PairingEmailProps) => {
  return render(<PairingEmail {...props} />);
};

export default renderPairing;
