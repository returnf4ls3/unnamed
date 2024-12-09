import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-custom': `
          linear-gradient(
            to bottom right,
            rgba(255, 122, 89, 0.8),
            rgba(255, 170, 145, 0.7),
            rgba(183, 102, 223, 0.9)
          )
        `,
      },
    },
  },
  plugins: [],
} satisfies Config;
