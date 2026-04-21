"use client";
import { useChecklists } from "@/contexts/ChecklistContextProvider";
import { Checklist, ChecklistGroup } from "@/interfaces/Checklist";
import { saveChecklistsTemplates } from "@/services/checklist";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const defaultTemplates = () => {
    return `Checklist Title

{items}`.trim();
};

export const ChecklistTemplateForm = ({
    groups,
}: {
    groups: ChecklistGroup[];
}) => {
    const { checklists: serverChecklists, isFetchingChecklists } =
        useChecklists();

    const [activeChecklistId, setActiveChecklistId] = useState<string>("");
    const [checklists, setChecklists] = useState<Checklist[]>([]);

    const checklist = useMemo(() => {
        if (checklists.length === 0) return null;

        return checklists.find((c) => c.id === activeChecklistId);
    }, [checklists, activeChecklistId]);

    useEffect(() => {
        if (isFetchingChecklists) return;

        const _checklists = serverChecklists.filter((c) =>
            groups.includes(c.group),
        );

        if (_checklists.length === 0) return;

        setChecklists(
            _checklists.map((c) => {
                if (!c.template) c.template = defaultTemplates();
                return c;
            }),
        );
    }, [serverChecklists, isFetchingChecklists]);

    useEffect(() => {
        if (checklists.length === 0 || activeChecklistId) return;

        setActiveChecklistId(checklists[0].id!);
    }, [checklists, activeChecklistId]);

    const renderedPreview = useMemo(() => {
        if (!checklist || !checklist.template) return "";

        return checklist.template.replace(
            /{items}/g,
            `✅ Sample Item 1
❌ Sample Item 2`,
        );
    }, [checklists, checklist]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        const { value } = e.target;

        setChecklists((prev) => {
            const newChecklists = [...prev];
            const itemIndex = newChecklists.findIndex(
                (c) => c.id === activeChecklistId,
            );
            newChecklists[itemIndex].template = value;
            return newChecklists;
        });
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        toast.promise(saveChecklistsTemplates(checklists), {
            loading: "Saving templates...",
            success: "Templates saved successfully!",
            error: "Failed to save templates.",
        });
    };

    return (
        <form
            id="checklist-template-form"
            onSubmit={handleSubmit}
            className="space-y-4"
        >
            {/* Toggle */}
            <Paper>
                {activeChecklistId && (
                    <Tabs
                        value={activeChecklistId}
                        variant="scrollable"
                        scrollButtons="auto"
                        onChange={(_, value) => {
                            setActiveChecklistId(value);
                        }}
                        sx={{
                            [`& .${tabsClasses.scrollButtons}`]: {
                                "&.Mui-disabled": { opacity: 0.3 },
                            },
                        }}
                    >
                        {checklists.map((c) => (
                            <Tab key={c.id} value={c.id} label={c.title} />
                        ))}
                    </Tabs>
                )}
            </Paper>

            <div className="grid grid-cols-2 gap-4 items-stretch">
                <div className="flex flex-col">
                    <label className="mb-2">
                        {checklist?.title ?? "Template"}
                    </label>
                    <textarea
                        name={checklist?.id}
                        className="flex-1 min-h-75 p-2 rounded border border-zinc-800  text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f89f8e] text-sm resize-none"
                        value={checklist?.template}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-2">Preview</label>
                    <Paper className="flex-1 min-h-75 overflow-auto p-4 rounded text-gray-200 whitespace-pre-wrap">
                        {renderedPreview}
                    </Paper>
                </div>
            </div>
        </form>
    );
};
