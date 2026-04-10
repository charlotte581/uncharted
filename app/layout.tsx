import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Uncharted — Is your idea original?",
  description:
    "Find out if your idea, question, or thought is truly original. Encouraging original human thought.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
