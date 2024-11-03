import { Text } from "@react-email/components";
import { getAvatarFile, getInitials } from "@/lib/utils";

interface MailSantaAvatarProps {
  baseUrl: string;
  name: string;
  id?: string;
}

export function MailSantaAvatar({ baseUrl, name, id }: MailSantaAvatarProps) {
  const avatarFile = id && getAvatarFile(id);
  const initials = getInitials(name);
  const imageUrl = avatarFile ? `${baseUrl}${avatarFile}` : "";

  return (
    <table
      cellPadding="0"
      cellSpacing="0"
      border={0}
      role="presentation"
      style={{
        borderCollapse: "collapse",
        width: "64px",
      }}
    >
      <tr>
        <td
          style={{
            position: "relative",
            width: "64px",
            height: "64px",
            borderRadius: "48px",
            backgroundColor: "#f3f4f6",
            overflow: "hidden",
          }}
        >
          {/* Background Image Container */}
          {avatarFile && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "64px",
                height: "64px",
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                zIndex: 1,
              }}
            />
          )}

          {/* Text Overlay Container */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "64px",
              height: "64px",
              backgroundColor: avatarFile
                ? "rgba(0, 0, 0, 0.6)"
                : "transparent",
              zIndex: 2,
            }}
          >
            <table
              cellPadding="0"
              cellSpacing="0"
              border={0}
              role="presentation"
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <tr>
                <td
                  align="center"
                  style={{
                    fontSize: "18px",
                    lineHeight: "64px",
                    fontFamily: "Arial, sans-serif",
                    color: avatarFile ? "#FFFFFF" : "#666666",
                    verticalAlign: "middle",
                    textAlign: "center",
                  }}
                >
                  <Text
                    style={{
                      margin: "0",
                      color: avatarFile ? "#FFFFFF" : "#666666",
                      fontSize: "18px",
                      lineHeight: "64px",
                    }}
                  >
                    {initials}
                  </Text>
                </td>
              </tr>
            </table>
          </div>
        </td>
      </tr>
    </table>
  );
}

export default MailSantaAvatar;
