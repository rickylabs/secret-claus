import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        'santa-white': '#FFFBF2',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  compilerOptions: {
    skipLibCheck: true,
  }
} satisfies Config;
