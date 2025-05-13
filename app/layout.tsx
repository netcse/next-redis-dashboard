// This file is a part of the Next.js application layout.
// It defines the root layout for the application, including global styles and font imports.

import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "@/app/styles/globals.css";
import React from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "React Next.js Redis App",
    description: "Dashboard",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable}  antialiased`}
        >
        {children}
        </body>
        </html>
    );
}
