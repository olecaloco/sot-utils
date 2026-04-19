import { Show, UserButton } from "@clerk/nextjs";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import Link from "next/link";

export const PortalHeader = () => {
    return (
        <Box>
            <Stack component={"header"} sx={{ p: 2 }}>
                <div className="w-full flex items-center justify-between">
                    <Link href="/">
                        <Image
                            className="w-full max-w-25"
                            src="/logo.png"
                            alt="SOT Utils"
                            width={1967}
                            height={534}
                        />
                    </Link>
                    <Show when="signed-in">
                        <UserButton />
                    </Show>
                </div>
            </Stack>
            <Divider />
        </Box>
    );
};
