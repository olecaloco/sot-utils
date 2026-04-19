import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";
import { FirebaseAuthWrap } from "@/components/FirebaseAuthWrap";
import { Toaster } from "sonner";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

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
        <html lang="en" className={`${geistSans.variable}`}>
            <body>
                <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                    <ThemeProvider defaultMode="dark" theme={theme}>
                        <CssBaseline />
                        <ClerkProvider appearance={{ theme: dark }}>
                            <FirebaseAuthWrap>
                                {children}
                                <Toaster position="top-right" />
                            </FirebaseAuthWrap>
                        </ClerkProvider>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
