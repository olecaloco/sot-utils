"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import { Button, Stack } from "@mui/material";
import { Link } from "@/components/common/Link";
import { ArrowRightIcon } from "lucide-react";

const PortalButton = () => (
    <Button
        LinkComponent={Link}
        href="/portal"
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
        Go to Admin
    </Button>
);

const NotYouButton = ({ name }: { name?: string }) => (
    <SignOutButton>
        <a
            className="text-zinc-300 text-sm underline underline-offset-4"
            href="#"
        >
            Not {name}? Change account
        </a>
    </SignOutButton>
);

export const AccountButtons = () => {
    const { user } = useUser();

    if (!user) return;

    return (
        <Stack
            direction={"column"}
            spacing={6}
            sx={{ pb: 10, alignItems: "center" }}
        >
            {user.publicMetadata.role === "admin" && <PortalButton />}
            <NotYouButton name={user.primaryEmailAddress?.emailAddress} />
        </Stack>
    );
};
