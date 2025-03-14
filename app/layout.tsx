import type { Metadata } from "next";
import "./globals.css";
import Provider from "./Provider";
import Header from "./components/Nav/Header";
import Footer from "./components/Nav/Footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Настан.мк",
  description: "Create by Daniel",
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
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
