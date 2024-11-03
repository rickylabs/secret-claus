import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
  render,
} from "@react-email/components";
import * as React from "react";
import { z } from "zod";
import { MailFooter } from "@/app/novu/emails/_components/footer";
import { MailSantaAvatar } from "@/app/novu/emails/_components/mail-avatar";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

// Default values with type annotation
export const INVITE_DEFAULTS = {
  guestName: "Guest Name",
  giverId: "ddc37c4e-33c5-4fc1-8bd7-f51a61084d24",
  invitedByUsername: "Giver Name",
  invitedByEmail: "giver.name@mail.com",
  invitedByPhone: "+41791234567",
  eventName: "Event Name",
  guestAvatar: `${baseUrl}/unknown_user.png`,
  inviteLink: `${baseUrl}/events/unknown`,
};

export const PairingEmailSchema = z.object({
  guestName: z.string().optional().default(INVITE_DEFAULTS.guestName),
  giverId: z.string().optional().default(INVITE_DEFAULTS.giverId),
  invitedByUsername: z
    .string()
    .optional()
    .default(INVITE_DEFAULTS.invitedByUsername),
  invitedByEmail: z
    .string()
    .email()
    .optional()
    .default(INVITE_DEFAULTS.invitedByEmail),
  invitedByPhone: z.string().optional().default(INVITE_DEFAULTS.invitedByPhone),
  eventName: z.string().optional().default(INVITE_DEFAULTS.eventName),
  guestAvatar: z.string().optional().default(INVITE_DEFAULTS.guestAvatar),
  inviteLink: z.string().url().optional().default(INVITE_DEFAULTS.inviteLink),
  inviteFromIp: z.string().optional(),
  inviteFromLocation: z.string().optional(),
});

type PairingEmailProps = z.infer<typeof PairingEmailSchema>;

const PairingEmail = ({
  guestName,
  giverId,
  invitedByUsername,
  invitedByEmail,
  eventName,
  guestAvatar,
  inviteLink,
  inviteFromIp,
  inviteFromLocation,
}: PairingEmailProps) => {
  const previewText = `Join ${invitedByUsername} on Vercel`;

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
              {`Participez à l'évènement `}
              <strong>{eventName}</strong>
              {` sur `}
              <strong>Secret Claus</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {guestName},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>{invitedByUsername} </strong>(
              <Link
                href={`mailto:${invitedByEmail}`}
                className="text-blue-600 no-underline"
              >
                {invitedByEmail}
              </Link>
              ) {`vous a invité à l'évènement`} <strong>{eventName}</strong>
            </Text>
            <Section>
              <Row>
                <Column align="right">
                  <MailSantaAvatar
                    baseUrl={baseUrl}
                    id={giverId}
                    name={guestName}
                  />
                </Column>
                <Column align="center">
                  <Img
                    src={`${baseUrl}/x.png`}
                    width="20"
                    height="20"
                    alt="invited you to"
                  />
                </Column>
                <Column align="left">
                  <Img
                    className="rounded-full"
                    src={guestAvatar}
                    width="64"
                    height="64"
                  />
                </Column>
              </Row>
            </Section>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-green-600 px-5 py-3 text-center text-[12px] font-semibold text-white no-underline hover:bg-green-800"
                href={inviteLink}
              >
                Découvrez votre invité secret
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              {`Ou copiez le lien ci-dessous pour découvrir votre invité secret: `}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <MailFooter />
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This invitation was intended for{" "}
              <span className="text-black">{guestName}</span>. This invite was
              sent from <span className="text-black">{inviteFromIp}</span>{" "}
              located in{" "}
              <span className="text-black">{inviteFromLocation}</span>. If you
              were not expecting this invitation, you can ignore this email. If
              you are concerned about your account safety, please reply to this
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
