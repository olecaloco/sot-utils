import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import {
    ArrowRightIcon,
    BadgeDollarSignIcon,
    PlayIcon,
    PowerIcon,
} from "lucide-react";
import Link from "next/link";
import { UtilCard } from "@/components/common/UtilCard";
import Image from "next/image";

export default function Home() {
    return (
        <div className="px-4 pt-10 md:pt-0 h-full flex flex-col items-center md:justify-center gap-6">
            <Image
                className="w-full max-w-75"
                src="/logo.png"
                alt="SOT Utils"
                width={1967}
                height={534}
            />

            <div className="flex flex-col md:flex-row gap-3">
                <UtilCard
                    title="Trainee Checklists"
                    description="Checklists for the newbies"
                    href="/trainee-checklists"
                    icon={<PlayIcon className="w-6 h-6" />}
                />
                <UtilCard
                    title="Pre-stream checklist"
                    description="Manage your pre-stream checklist for pasting into Slack"
                    href="/pre-stream-checklist"
                    icon={<PlayIcon className="w-6 h-6" />}
                />
                <UtilCard
                    title="Post-stream checklist"
                    description="Check your post stream checklist for pasting into Slack"
                    href="/post-stream-checklist"
                    icon={<PowerIcon className="w-6 h-6" />}
                />
                <UtilCard
                    title="Token notes"
                    description="Generate token notes CSV file"
                    href="/token-notes"
                    icon={<BadgeDollarSignIcon className="w-6 h-6" />}
                />
            </div>

            <Show when="signed-out">
                <SignInButton>
                    <a
                        className="flex items-center gap-1 text-sm underline"
                        href="#"
                    >
                        <span>Go to Admin</span>
                        <ArrowRightIcon className="w-4 h-4" />
                    </a>
                </SignInButton>
            </Show>
            <Show when="signed-in">
                <Link
                    className="flex items-center gap-1 text-sm underline"
                    href="/portal"
                >
                    <span>Go to Admin</span>
                    <ArrowRightIcon className="w-4 h-4" />
                </Link>
            </Show>
        </div>
    );
}
