import { ReactElement } from "react";
import { Checklist } from "@/interfaces/Checklist";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Image from "next/image";

interface MultiChecklistItemsProps {
    items: Checklist["items"];
    handleCheckChange: (checked: boolean, index: number) => void;
}

export function MultiChecklistItems(
    props: MultiChecklistItemsProps,
): ReactElement {
    const { items, handleCheckChange } = props;

    return (
        <Box className="flex-1 p-1 overflow-y-auto">
            {items.length > 0 && (
                <FormGroup
                    className="flex-nowrap overflow-y-auto"
                    sx={{ height: "100%" }}
                >
                    {items.length === 0 && (
                        <div className="flex flex-col items-center justify-center px-4 py-2 h-full gap-4">
                            <Image
                                src="https://cdn.7tv.app/emote/01FC1B04XR000E3W5GESZFF1AY/2x.webp"
                                alt="Shrug"
                                width={66}
                                height={64}
                            />
                            <p className="text-zinc-700">
                                Welp, this item is not found.
                            </p>
                        </div>
                    )}
                    {items.map((item, index) => (
                        <Box key={index}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        value={item.text}
                                        checked={item.checked}
                                        onChange={(_, checked) =>
                                            handleCheckChange(checked, index)
                                        }
                                        sx={{ p: 0.5 }}
                                    />
                                }
                                label={item.text}
                                sx={{
                                    p: 0,
                                    m: 0,
                                    color: "var(--color-zinc-300)",
                                }}
                            />
                        </Box>
                    ))}
                </FormGroup>
            )}
        </Box>
    );
}
