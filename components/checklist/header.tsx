import Link from "next/link";
import Stack from "@mui/material/Stack";
import { ArrowLeftIcon } from "lucide-react";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

export function ChecklistHeader({ title }: { title: string }) {
    return (
        <Stack
            direction="row"
            sx={{
                alignItems: "center",
                p: 1,
                gap: 1,
            }}
        >
            <IconButton LinkComponent={Link} href="/">
                <ArrowLeftIcon className="w-6 h-6 text-gray-500" />
            </IconButton>
            <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
        </Stack>
    );
}
