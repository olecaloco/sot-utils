import { PortalHeader } from "@/components/portal/Header";
import { PortalNavigation } from "@/components/portal/Navigation";

export default function PortalLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex h-full flex-col">
            <PortalHeader />
            <div className="flex flex-1 container mx-auto">
                <aside className="pt-10 border-r border-gray-800 w-60 shrink-0">
                    <PortalNavigation />
                </aside>
                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
}
