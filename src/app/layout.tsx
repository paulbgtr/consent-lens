import type { Metadata } from "next";
import { Chivo } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const chivo = Chivo({ subsets: ["latin"] });

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
      <body className={chivo.className}>
        <div className="min-h-screen flex flex-col max-w-7xl mx-auto">
          <header className="bg-card shadow-sm px-4 sm:px-6">
            <div className="py-3 flex justify-between items-center">
              <Link href="/" className="flex items-center">
                <span className="text-xl mr-1.5">🔍</span>
                <span className="font-bold text-lg">Consent Lens</span>
              </Link>
              <nav className="space-x-5">
                <Link href="/why" className="hover:underline text-sm">
                  why?
                </Link>
              </nav>
            </div>
          </header>

          <div className="flex-1">{children}</div>

          <footer className="bg-card shadow-inner mt-8 py-4 px-4 sm:px-6">
            <div className="text-center text-xs">
              <p>
                © {new Date().getFullYear()} Consent Lens. Built with ❤️ by{" "}
                <Link href="https://paulbg.dev" className="hover:underline">
                  paulbg
                </Link>
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
