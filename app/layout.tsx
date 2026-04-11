import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";
import { FirebaseAuthWrap } from "@/components/FirebaseAuthWrap";
import { Toaster } from "sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "SOT Utils",
    description: "Set of utilities for Stream Operations",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${geistSans.variable} h-full`}>
            <body className="text-white h-full bg-slate-950">
                <ClerkProvider appearance={{ theme: dark }}>
                    <FirebaseAuthWrap>
                        {children}
                        <Toaster position="top-right" />
                    </FirebaseAuthWrap>
                </ClerkProvider>
            </body>
        </html>
    );
}
