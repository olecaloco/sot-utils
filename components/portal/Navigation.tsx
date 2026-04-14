"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";

const LINKS = [
    {
        href: "/portal/checklist-template",
        label: "Template",
    },
    {
        href: "/portal/team/pre-stream-checklist",
        label: "Team Pre-stream",
    },
    {
        href: "/portal/team/post-stream-checklist",
        label: "Team Post-stream",
    },
    {
        href: "/portal/model/pre-stream-checklist",
        label: "Model Pre-stream",
    },
    {
        href: "/portal/model/post-stream-checklist",
        label: "Model Post-stream",
    },
];

const TRAINEE_LINKS = [
    {
        href: "/portal/trainee/checklist-template",
        label: "Template",
    },
    {
        href: "/portal/trainee/stream-prep",
        label: "Trainee Stream Prep",
    },
    {
        href: "/portal/trainee/team-prestream",
        label: "Trainee Team Pre-stream",
    },
    {
        href: "/portal/trainee/model-pre-stream",
        label: "Trainee Model Pre-stream",
    },
    {
        href: "/portal/trainee/cb-prestream",
        label: "Trainee CB Pre-stream",
    },
    {
        href: "/portal/trainee/mts-prestream",
        label: "Trainee MTS Pre-stream",
    },
    {
        href: "/portal/trainee/phone-prestream",
        label: "Trainee Phone Pre-stream",
    },
    {
        href: "/portal/trainee/during-stream",
        label: "Trainee During Stream",
    },
    {
        href: "/portal/trainee/post-stream",
        label: "Trainee Post Stream",
    },
];

export function PortalNavigation() {
    const pathname = usePathname();

    return (
        <nav>
            <ul className="flex flex-col gap-1">
                <li className="text-sm font-semibold mb-2 text-gray-200 uppercase">
                    <span>General</span>
                </li>
                <li className="mb-4">
                    <Link
                        href="/"
                        className="text-sm text-gray-600 hover:text-gray-400"
                    >
                        <span>Back to Home</span>
                    </Link>
                </li>
                <li className="text-sm font-semibold mb-2 text-gray-200 uppercase">
                    <span>Checklist</span>
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
                <li className="text-sm font-semibold mb-2 text-gray-200 uppercase mt-4">
                    <span>TRAINING</span>
                </li>
                {TRAINEE_LINKS.map((link) => (
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
