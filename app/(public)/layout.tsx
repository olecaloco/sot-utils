import { ChecklistContextProvider } from "@/contexts/ChecklistContextProvider";
import React from "react";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ChecklistContextProvider>{children}</ChecklistContextProvider>;
}
