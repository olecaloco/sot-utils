import { ReactElement } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

interface ChecklistFooterProps {
    handleCopy: () => void;
}

export function ChecklistFooter(props: ChecklistFooterProps): ReactElement {
    const { handleCopy } = props;

    return (
        <Stack
            sx={{
                alignItems: "flex-end",
                p: 1,
            }}
        >
            <Button variant={"contained"} onClick={handleCopy}>
                Copy
            </Button>
        </Stack>
    );
}
