import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import {
    ArrowRightIcon,
    BadgeDollarSignIcon,
    PlayIcon,
    PowerIcon,
} from "lucide-react";
import Link from "next/link";
import { UtilCard } from "@/components/common/UtilCard";

export default function Home() {
    return (
        <div className="px-4 h-full flex flex-col items-center justify-center gap-6">
            <h1 className="text-4xl font-bold text-white">SOT Utils</h1>

            <div className="flex flex-col md:flex-row gap-3">
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
