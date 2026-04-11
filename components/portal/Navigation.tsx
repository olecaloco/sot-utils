"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";

const LINKS = [
    {
        href: "/portal/pre-stream-checklist",
        // icon: <PlayIcon className="w-4 h-4" />,
        label: "Pre-stream checklist",
    },
    {
        href: "/portal/post-stream-checklist",
        // icon: <PowerIcon className="w-4 h-4" />,
        label: "Post-stream checklist",
    },
];

export function PortalNavigation() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-25.25 z-10">
            <ul className="flex flex-col gap-1">
                <li className="text-sm font-semibold mb-2 text-gray-200">
                    <span>GENERAL</span>
                </li>
                {LINKS.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className={cn("text-sm", {
                                "text-gray-200 font-bold":
                                    pathname === link.href,
                                "text-gray-600 hover:text-gray-400":
                                    pathname !== link.href,
                            })}
                        >
                            <span>{link.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
