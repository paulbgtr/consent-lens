import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Consent Lens | Simplified Terms & Privacy Policies",
  description:
    "Consent Lens helps you understand Terms of Service and Privacy Policies with simplified, human-readable summaries.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-card shadow-sm">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <Link href="/" className="flex items-center">
                <span className="text-2xl mr-2">🔍</span>
                <span className="font-bold text-xl">Consent Lens</span>
              </Link>
              <nav className="space-x-6">
                <Link href="/" className="hover:underline">
                  Home
                </Link>
                <Link href="#" className="hover:underline">
                  About
                </Link>
              </nav>
            </div>
          </header>

          <div className="flex-1">{children}</div>

          <footer className="bg-card shadow-inner mt-10 py-6">
            <div className="container mx-auto px-4 text-center text-sm">
              <p>
                © {new Date().getFullYear()} Consent Lens. This is a demo
                project.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
