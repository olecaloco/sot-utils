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
        href: "/portal/checklists/team_prestream",
        label: "Team Pre-stream",
    },
    {
        href: "/portal/checklists/model_prestream",
        label: "Model Pre-stream",
    },
    {
        href: "/portal/checklists/poststream",
        label: "Post-stream",
    },
];

const TRAINEE_LINKS = [
    {
        href: "/portal/trainee/checklist-template",
        label: "Template",
    },
    {
        href: "/portal/checklists/trainee_stream_prep",
        label: "Trainee Stream Prep",
    },
    {
        href: "/portal/checklists/trainee_team_prestream",
        label: "Trainee Team Pre-stream",
    },
    {
        href: "/portal/checklists/trainee_model_prestream",
        label: "Trainee Model Pre-stream",
    },
    {
        href: "/portal/checklists/trainee_cb_prestream",
        label: "Trainee CB Pre-stream",
    },
    {
        href: "/portal/checklists/trainee_mts_prestream",
        label: "Trainee MTS Pre-stream",
    },
    {
        href: "/portal/checklists/trainee_phone_prestream",
        label: "Trainee Phone Pre-stream",
    },
    {
        href: "/portal/checklists/trainee_during_stream",
        label: "Trainee During Stream",
    },
    {
        href: "/portal/checklists/trainee_troubleshooting",
        label: "Trainee Troubleshooting",
    },
    {
        href: "/portal/checklists/trainee_poststream",
        label: "Trainee Post-stream",
    },
    {
        href: "/portal/checklists/trainee_first_stream",
        label: "Trainee First stream",
    },
];

const SubHeader = ({ title }: { title: string }) => (
    <li className="px-4 my-4 text-sm font-semibold text-gray-300 uppercase">
        <span>{title}</span>
    </li>
);

const NavItem = ({
    href,
    label,
    active,
}: {
    href: string;
    label: string;
    active?: boolean;
}) => (
    <li
        className={cn("px-4", {
            "bg-[#f89f8e]/10": active,
        })}
    >
        <Link
            href={href}
            className={cn("text-sm", {
                "text-[#f89f8e]": active,
                "text-gray-600 hover:text-gray-300": !active,
            })}
        >
            <span>{label}</span>
        </Link>
    </li>
);

export function PortalNavigation() {
    const pathname = usePathname();

    return (
        <nav className="flex-1 h-full overflow-y-auto pb-4">
            <ul className="flex flex-col gap-1">
                <SubHeader title="General" />
                <NavItem href="/" label="Back to Home" />
                <SubHeader title="Checklist" />
                {LINKS.map((link) => (
                    <NavItem
                        key={link.href}
                        href={link.href}
                        label={link.label}
                        active={pathname === link.href}
                    />
                ))}
                <SubHeader title="Training" />
                {TRAINEE_LINKS.map((link) => (
                    <NavItem
                        key={link.href}
                        href={link.href}
                        label={link.label}
                        active={pathname === link.href}
                    />
                ))}
            </ul>
        </nav>
    );
}
