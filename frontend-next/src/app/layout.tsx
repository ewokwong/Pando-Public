import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Find a Tennis Partner",
  description: "Pando Tennis - Find a Tennis Partner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <head>
          {/* Include the Cloudinary Video Player script */}
          <script
            src="https://unpkg.com/cloudinary-video-player/dist/cld-video-player.min.js"
            async
          ></script>
          <link
            rel="stylesheet"
            href="https://unpkg.com/cloudinary-video-player/dist/cld-video-player.min.css"
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <Analytics />
          <div id="modal-root"></div>
        </body>
      </html>
    </AuthProvider>
  );
}