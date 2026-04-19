import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SquareArrowOutUpRightIcon } from "lucide-react";
import Link from "next/link";

export function UtilCard({
    title,
    description,
    href,
    icon,
    external,
}: Readonly<{
    title: string;
    description: string;
    href: string;
    icon?: React.ReactNode;
    external?: boolean;
}>) {
    if (external) {
        return (
            <a className="w-full max-w-75 min-h-0" href={href} target="_blank">
                <Card
                    className="hover:bg-[#f89f8e]/10 transition"
                    sx={{ height: "100%" }}
                >
                    <CardContent>
                        <Box sx={{ mb: 2 }}>{icon}</Box>
                        <Stack
                            direction={"row"}
                            spacing={1}
                            sx={{ alignItems: "center" }}
                        >
                            <Typography sx={{ fontWeight: "bold" }}>
                                {title}
                            </Typography>
                            <SquareArrowOutUpRightIcon className="w-4" />
                        </Stack>
                        <Typography variant="caption" color="textSecondary">
                            {description}
                        </Typography>
                    </CardContent>
                </Card>
            </a>
        );
    }
    return (
        <Link className="w-full max-w-75 min-h-0" href={href}>
            <Card
                className="hover:bg-[#f89f8e]/10 transition"
                sx={{ height: "100%" }}
            >
                <CardContent>
                    <Box sx={{ mb: 2 }}>{icon}</Box>
                    <Typography sx={{ fontWeight: "bold" }}>{title}</Typography>
                    <Typography variant="caption" color="textSecondary">
                        {description}
                    </Typography>
                </CardContent>
            </Card>
        </Link>
    );
}
