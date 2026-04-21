"use client";

import { Checklist, ChecklistGroup } from "@/interfaces/Checklist";
import { ChecklistHeader } from "../header";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ChecklistFooter } from "../footer";
import { MultiChecklistTabs } from "./tabs";
import { MultiChecklistItems } from "./items";
import Stack from "@mui/material/Stack";
import { useChecklists } from "@/contexts/ChecklistContextProvider";

export function MultiTabbedChecklist({
    title,
    group,
}: {
    title: string;
    group: ChecklistGroup;
}) {
    const { checklists: serverChecklists, isFetchingChecklists } =
        useChecklists();

    const [checklists, setChecklists] = useState<Checklist[]>([]);
    const [activeChecklist, setActiveChecklist] = useState<string>("");
    const [checklistItems, setChecklistItems] = useState<Checklist["items"]>(
        [],
    );

    const checklist = useMemo(() => {
        if (!activeChecklist) return null;

        return checklists.find((c) => c.id === activeChecklist);
    }, [checklists, activeChecklist]);

    // Fetch Checklist items for all types
    useEffect(() => {
        if (isFetchingChecklists) return;

        const _checklists = serverChecklists.filter((c) => c.group === group);

        if (!_checklists) return;

        setChecklists(_checklists);

        if (_checklists.length > 0) {
            setActiveChecklist(_checklists[0].id!);
        }
    }, [serverChecklists, isFetchingChecklists, group]);

    useEffect(() => {
        const checklist = checklists.find((c) => c.id === activeChecklist);
        if (!checklist) return;

        setChecklistItems(checklist.items);
    }, [activeChecklist, checklists]);

    const handleCheckChange = (checked: boolean, index: number) => {
        setChecklistItems((prev) => {
            const newChecklist = [...prev];
            newChecklist[index].checked = checked;
            return newChecklist;
        });
    };

    const handleCopy = async (): Promise<void> => {
        const _checklistItems = checklistItems
            .map((item) => `${item.checked ? "✅" : "❌"} ${item.text}`)
            .join("\n");

        let clipboardText = checklist?.template || "{items}";
        clipboardText = clipboardText.replace("{items}", _checklistItems);

        await navigator.clipboard.writeText(clipboardText);
        toast.success("Checklist data is ready to paste!");
    };

    return (
        <div className="flex flex-col w-full h-dvh">
            <ChecklistHeader title={title} />

            <Stack
                direction={{ xs: "column", md: "row" }}
                sx={{ flex: 1, minHeight: 0 }}
            >
                {activeChecklist && (
                    <MultiChecklistTabs
                        checklists={checklists}
                        activeChecklist={activeChecklist}
                        setActiveChecklist={setActiveChecklist}
                    />
                )}

                <MultiChecklistItems
                    items={checklistItems}
                    handleCheckChange={handleCheckChange}
                />
            </Stack>

            <ChecklistFooter handleCopy={handleCopy} />
        </div>
    );
}
