import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pharmacy MS",
  description: "Pharmacy Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-gray-50">
        <div className="flex h-screen">

          <Sidebar />

          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}