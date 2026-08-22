import type { Metadata, Viewport } from "next";
import { JobTicketRail } from "@/components/ui";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Surge Labs",
  description:
    "Full-service agency in Mississauga, Ontario. Web and digital, print and signage, custom apparel — all in-house.",
};

export const viewport: Viewport = {
  themeColor: "#0C0C0E",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The document sits on the press bed by default; sheets override it.
    <html lang="en-CA" data-surface="ink" className={fontVariables}>
      <body>
        <JobTicketRail />
        {children}
      </body>
    </html>
  );
}
