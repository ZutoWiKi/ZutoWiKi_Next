import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import FloatingMenu from "@/components/FloatingMenu";

export const metadata: Metadata = {
  title: "윤슬 | Yoonseul",
  description: "Developed by lgh, lhj",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <FloatingMenu />
        {children}
      </body>
    </html>
  );
}
