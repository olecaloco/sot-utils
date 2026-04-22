import Image from "next/image";

import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import { Show, SignInButton } from "@clerk/nextjs";
import {
    ArrowRightIcon,
    BadgeDollarSignIcon,
    BookOpenIcon,
    BotMessageSquareIcon,
    PlayIcon,
    PowerIcon,
} from "lucide-react";

import { Link } from "@/components/common/Link";
import { UtilCard } from "@/components/common/UtilCard";
import { AccountButtons } from "@/components/AccountButtons";

export default async function Home() {
    return (
        <Stack
            sx={{
                pt: {
                    xs: 12,
                    sm: 12,
                    md: 16,
                },
                px: 2,
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
            }}
        >
            <Image
                className="w-full max-w-75"
                src="/logo.png"
                alt="SOT Utils"
                width={1967}
                height={534}
            />

            <Grid
                container
                spacing={1}
                columns={{ xs: 1, sm: 2, md: 5 }}
                sx={{ justifyContent: "center" }}
            >
                <UtilCard
                    title="Trainee Checklists"
                    description="Checklists for the newbies"
                    href="/trainee-checklists"
                    icon={<BookOpenIcon className="w-6 h-6" />}
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
                <UtilCard
                    title="Stream title GPT"
                    description="AI help for your stream titles"
                    href="https://chatgpt.com/g/g-69d4d97cf16081918b83ba3d7cd9fcbe-stream-titles-for-aruna-sot"
                    icon={<BotMessageSquareIcon className="w-6 h-6" />}
                    external
                />
            </Grid>

            <Show when="signed-out">
                <SignInButton>
                    <Button
                        LinkComponent={"a"}
                        endIcon={<ArrowRightIcon />}
                        sx={{
                            ".MuiButton-icon": {
                                transition: "all 150ms ease-in-out",
                            },
                            ":hover .MuiButton-icon": {
                                ml: 2,
                            },
                        }}
                    >
                        <span>Go to Admin</span>
                    </Button>
                </SignInButton>
            </Show>
            <Show when="signed-in">
                <AccountButtons />
            </Show>
        </Stack>
    );
}
