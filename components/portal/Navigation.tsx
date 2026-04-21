"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";
import IconButton from "@mui/material/IconButton";
import { PlusIcon } from "lucide-react";
import { useChecklists } from "@/contexts/ChecklistContextProvider";
import { ChecklistGroup } from "@/interfaces/Checklist";
import Skeleton from "@mui/material/Skeleton";

const SubHeader = ({
    title,
    showCreateButton,
    createHref,
}: {
    title: string;
    showCreateButton?: boolean;
    createHref?: string;
}) => {
    if (showCreateButton && createHref) {
        return (
            <li className="flex items-center justify-between px-4 my-4 text-sm font-semibold text-gray-300 uppercase">
                <span>{title}</span>
                <IconButton LinkComponent={Link} href={createHref} size="small">
                    <PlusIcon fontSize="small" className="w-4 h-4" />
                </IconButton>
            </li>
        );
    }
    return (
        <li className="px-4 my-4 text-sm font-semibold text-gray-300 uppercase">
            <span>{title}</span>
        </li>
    );
};

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

const PortalNav = () => {
    const { checklists, isFetchingChecklists } = useChecklists();
    const pathname = usePathname();

    const operationsChecklist = checklists.filter(
        (c) => c.group !== ChecklistGroup.Training,
    );
    const trainingChecklist = checklists.filter(
        (c) => c.group === ChecklistGroup.Training,
    );

    return (
        <nav className="flex-1 h-full overflow-y-auto pb-4">
            <ul className="flex flex-col gap-1">
                <SubHeader title="General" />
                <NavItem href="/" label="Back to Home" />
                <SubHeader
                    title="Checklist"
                    createHref="/portal/checklists/create"
                    showCreateButton
                />
                <NavItem
                    href="/portal/checklists"
                    label="Re-order checklists"
                />
                <SubHeader title="Operations" />
                <NavItem
                    href="/portal/checklists/templates/operations"
                    label="Templates"
                    active={
                        pathname === "/portal/checklists/templates/operations"
                    }
                />
                {isFetchingChecklists && (
                    <>
                        <Skeleton className="mx-4" width={90} />
                        <Skeleton className="mx-4" width={90} />
                    </>
                )}
                {!isFetchingChecklists &&
                    operationsChecklist.map((link) => (
                        <NavItem
                            key={link.id}
                            href={`/portal/checklists/${link.id}`}
                            label={link.title}
                            active={
                                pathname === `/portal/checklists/${link.id}`
                            }
                        />
                    ))}
                <SubHeader title="Training" />
                <NavItem
                    label="Templates"
                    href="/portal/checklists/templates/training"
                    active={
                        pathname === "/portal/checklists/templates/training"
                    }
                />
                {isFetchingChecklists && (
                    <>
                        <Skeleton className="mx-4" width={90} />
                        <Skeleton className="mx-4" width={90} />
                    </>
                )}
                {!isFetchingChecklists &&
                    trainingChecklist.map((link) => (
                        <NavItem
                            key={link.id}
                            href={`/portal/checklists/${link.id}`}
                            label={link.title}
                            active={
                                pathname === `/portal/checklists/${link.id}`
                            }
                        />
                    ))}
            </ul>
        </nav>
    );
};

export function PortalNavigation() {
    return <PortalNav />;
}
