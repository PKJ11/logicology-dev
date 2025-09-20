import type { Metadata } from "next";
import "./globals.css";
import { Outfit, Roboto } from "next/font/google";

export const metadata: Metadata = {
  title: "Logicology",
  description: "Empowering Minds Through STEM Play and Logic-Based Learning",
};

// next/font loads, subsets, and self-hosts for you
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-roboto",
});

import FeedbackButton from "@/components/FeedbackButton";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${roboto.variable}`}>
      <body>
        {children}
        <FeedbackButton />
      </body>
    </html>
  );
}
