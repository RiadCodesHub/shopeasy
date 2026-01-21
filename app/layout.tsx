import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from '../src/lib/store/StoreProvider'
import Header from '../src/components/layouts/Header';
import Footer from "@/src/components/layouts/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopEasy - Your online shopping destination",
  description: "Premium e-commerce experience with best prices",
  verification: {
    google : "5BP6pwMPN87LBxn1xWf8cA8kn7qZZxTbW5y6JDnvKMU"
  }
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
                  <div className="min-h-screen flex flex-col">
            <Header />

            <main className="grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
