import { ReactElement } from "react";
import { Checklist, ChecklistType } from "@/interfaces/Checklist";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";

interface MultiChecklistItemsProps {
    activeType: ChecklistType;
    loading?: boolean;
    checklists: Record<ChecklistType, Checklist["items"]>;
    handleCheckChange: (checked: boolean, index: number) => void;
}

export function MultiChecklistItems(
    props: MultiChecklistItemsProps,
): ReactElement {
    const { activeType, checklists, handleCheckChange, loading } = props;

    return (
        <Box className="flex-1 p-1 overflow-y-auto">
            {loading && <p className="text-gray-500">Loading...</p>}
            {!loading && checklists[activeType] && (
                <FormGroup
                    className="flex-nowrap overflow-y-auto"
                    sx={{ height: "100%" }}
                >
                    {checklists[activeType].length === 0 && (
                        <div className="flex flex-col items-center justify-center px-4 py-2 h-full gap-4">
                            <img
                                src="https://cdn.7tv.app/emote/01FC1B04XR000E3W5GESZFF1AY/2x.webp"
                                alt="Shrug"
                            />
                            <p className="text-zinc-700">
                                Welp, this item is not found.
                            </p>
                        </div>
                    )}
                    {checklists[activeType].map((item, index) => (
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
                                sx={{ p: 0, m: 0 }}
                            />
                        </Box>
                    ))}
                </FormGroup>
            )}
        </Box>
    );
}
