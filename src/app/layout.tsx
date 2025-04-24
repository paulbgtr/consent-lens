import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Consent Lens - Simplified legal documents",
  description:
    "We read the fine print so you don't have to. Browse simplified, human-readable summaries of Terms of Service and Privacy Policies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}
      >
        <header className="bg-white shadow-sm">
          <nav className="container mx-auto p-4 flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl mr-2">🔍</span>
              <span className="font-bold text-xl">Consent Lens</span>
            </Link>
            <div className="flex gap-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600">
                Home
              </Link>
              <Link href="#" className="text-gray-700 hover:text-blue-600">
                About
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-grow">{children}</main>

        <footer className="bg-white shadow-inner mt-10 py-6">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            <p className="mb-2">
              Consent Lens helps you understand legal documents with simplified
              summaries.
            </p>
            <p>
              &copy; {new Date().getFullYear()} Consent Lens. All rights
              reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
