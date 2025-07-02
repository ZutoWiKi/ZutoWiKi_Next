import React from "react";
import FloatingMenu from "@/components/FloatingMenu";
import PageLayout from "@/components/PageLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PageLayout>
      <FloatingMenu />
      {children}
    </PageLayout>
  );
}
