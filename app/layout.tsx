import type { Metadata } from "next";
import "./globals.css";
import Provider from "./Provider";
import Header from "./components/Nav/Header";
import Footer from "./components/Nav/Footer";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "Настан.мк",
  description: "Created by Daniel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="winter">
      <body>
        <Provider>
          <Header />
          {children}
          <Toaster />
          <SpeedInsights />
          <Analytics />
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
