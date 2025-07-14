import AuthProvider from "@/components/auth/AuthProvider";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Harmoni",
  description: "A simple project manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AuthProvider />
        <Toaster
          richColors
          visibleToasts={3}
          expand
          duration={3000}
          position="top-right"
          closeButton
        />
        <div className="screen">
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
