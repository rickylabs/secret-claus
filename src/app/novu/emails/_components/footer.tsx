import { Column, Img, Link, Row, Section, Text } from "@react-email/components";

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const MailFooter = () => {
  return (
    <Section className="text-center">
      <table className="w-full">
        <tr className="w-full">
          <td align="center">
            <Img
              alt="Secret Santa logo"
              height="60"
              src={`${baseUrl}/favicon.png`}
            />
          </td>
        </tr>
        <tr className="w-full">
          <td align="center">
            <Text className="my-[8px] text-[16px] font-semibold leading-[24px] text-gray-900">
              Secret Claus
            </Text>
            <Text className="mb-0 mt-[4px] text-[16px] leading-[24px] text-gray-500">
              Get a surprise gift from a random person in your group !
            </Text>
          </td>
        </tr>
        <tr>
          <td align="center">
            <Row className="table-cell h-[60px] w-[60px] align-bottom">
              <Column className="pr-[16px]">
                <Link href="https://github.com/rickylabs">
                  <Img
                    alt="Github"
                    height="32"
                    src="https://cdn.brandfetch.io/github.com/w/60/h/60/symbol"
                  />
                </Link>
              </Column>
              <Column className="pr-[16px]">
                <Link href="https://x.com/rickyshowtime">
                  <Img
                    alt="X"
                    height="32"
                    src="https://cdn.brandfetch.io/x.com/w/60/h/60/logo"
                  />
                </Link>
              </Column>
              <Column>
                <Link href="https://www.linkedin.com/in/eric-chautems/">
                  <Img
                    alt="LinkedIn"
                    height="32"
                    src="https://cdn.brandfetch.io/linkedin.com/w/60/h/60/symbol"
                  />
                </Link>
              </Column>
            </Row>
          </td>
        </tr>
        <tr>
          <td align="center">
            <Text className="my-[8px] text-[12px] font-semibold leading-[24px] text-gray-500">
              Developed in Lausanne, Switzerland
            </Text>
          </td>
        </tr>
      </table>
    </Section>
  );
};
