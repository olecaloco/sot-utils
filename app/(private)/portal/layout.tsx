import { PortalHeader } from "@/components/portal/Header";
import { PortalNavigation } from "@/components/portal/Navigation";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

export default function PortalLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
<<<<<<< HEAD
        <Stack direction={"column"} sx={{ height: "100dvh" }}>
            <PortalHeader />
            <Stack direction={"row"} sx={{ flex: 1 }}>
=======
        <Stack direction={"column"} sx={{ height: "100%" }}>
            <PortalHeader />
            <Stack direction={"row"} sx={{ flex: 1, overflow: "hidden" }}>
>>>>>>> dev
                <Stack
                    component={"aside"}
                    direction={"row"}
                    sx={{
                        width: "240px",
                        minWidth: 0,
                        flexShrink: 0,
                        justifyContent: "space-between",
                    }}
                >
                    <PortalNavigation />
                    <Divider orientation="vertical" />
                </Stack>
<<<<<<< HEAD
                <main className="flex-1 overflow-hidden">{children}</main>
=======
                <main className="flex flex-col flex-1 overflow-hidden">
                    {children}
                </main>
>>>>>>> dev
            </Stack>
        </Stack>
    );
}
