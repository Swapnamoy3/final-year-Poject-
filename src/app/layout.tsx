import type { Metadata } from "next";
import "./globals.css";
import { Layout as DashboardLayout } from "@/components/Layout";

export const metadata: Metadata = {
  title: "Reveal LSO - Healthcare Dashboard",
  description: "LOS Software Tool Healthcare Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </body>
    </html>
  );
}
