import "./globals.css";
import Providers from "./providers";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Toaster } from "sonner";
import { Suspense } from "react";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "UniCloud",
  description:
    "A platform for university students to share and access PDF documents.",
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <Providers>
          <Suspense fallback={null}>
            <div className="mx-auto h-full w-full items-center justify-center">
              {children}
            </div>
          </Suspense>
          <Toaster richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
