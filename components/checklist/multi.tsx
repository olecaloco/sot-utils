"use client";

import { Checklist, ChecklistType } from "@/interfaces/Checklist";
import { ChecklistHeader } from "./header";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/utils";

const tabTitles: Record<ChecklistType, string> = {
    team_prestream: "Team",
    model_prestream: "Model",
    poststream: "Post-stream",
    trainee_stream_prep: "Stream Prep",
    trainee_team_prestream: "Team Pre-stream",
    trainee_during_stream: "During Stream",
    trainee_model_prestream: "Model Pre-stream",
    trainee_cb_prestream: "CB Pre-stream",
    trainee_mts_prestream: "MTS Pre-stream",
    trainee_phone_prestream: "Phone Pre-stream",
    trainee_troubleshooting: "Troubleshooting",
    trainee_poststream: "Post-stream",
};

export function MultiTabbedChecklist({
    title,
    types,
}: {
    title: string;
    types: ChecklistType[];
}) {
    const [loadingChecklists, setLoadingChecklists] = useState<
        Record<ChecklistType, boolean>
    >(
        Object.fromEntries(types.map((t) => [t, true])) as Record<
            ChecklistType,
            boolean
        >,
    );

    const [loadingTemplates, setLoadingTemplates] = useState<
        Record<ChecklistType, boolean>
    >(
        Object.fromEntries(types.map((t) => [t, true])) as Record<
            ChecklistType,
            boolean
        >,
    );

    const [templates, setTemplates] = useState<Record<ChecklistType, string>>(
        {} as Record<ChecklistType, string>,
    );
    const [activeType, setActiveType] = useState<ChecklistType>(types[0]);
    const [checklists, setChecklists] = useState<
        Record<ChecklistType, Checklist["items"]>
    >({} as Record<ChecklistType, Checklist["items"]>);

    // Fetch Checklist items for all types
    useEffect(() => {
        const requests = types.map((type) => {
            return getDoc(doc(db, "checklists", type))
                .then((docSnap) => {
                    setLoadingChecklists((prev) => ({
                        ...prev,
                        [type]: false,
                    }));

                    if (!docSnap.exists()) {
                        setChecklists((prev) => ({ ...prev, [type]: [] }));
                        return;
                    }

                    const data = docSnap.data() as Checklist;
                    setChecklists((prev) => ({ ...prev, [type]: data.items }));
                })
                .catch((error) => {
                    console.error(error);
                });
        });

        Promise.allSettled(requests);
    }, []);

    // Fetch templates for all types
    useEffect(() => {
        const requests = types.map((type) => {
            return getDoc(doc(db, "checklistTemplate", type))
                .then((docSnap) => {
                    setLoadingTemplates((prev) => ({
                        ...prev,
                        [type]: false,
                    }));

                    if (!docSnap.exists()) {
                        setTemplates((prev) => ({ ...prev, [type]: [] }));
                        return;
                    }

                    const data = docSnap.data() as { content: string };
                    setTemplates((prev) => ({ ...prev, [type]: data.content }));
                })
                .catch((error) => {
                    console.error(error);
                });
        });

        Promise.allSettled(requests);
    }, []);

    const handleCheckChange = (checked: boolean, index: number) => {
        setChecklists((prev) => {
            const newChecklist = [...prev[activeType]];
            newChecklist[index].checked = checked;
            return { ...prev, [activeType]: newChecklist };
        });
    };

    const handleCopy = async (): Promise<void> => {
        const checklistItems = checklists[activeType]
            .map((item) => `${item.checked ? "✅" : "❌"} ${item.text}`)
            .join("\n");

        let clipboardText = templates[activeType] || "{items}";
        clipboardText = clipboardText.replace("{items}", checklistItems);

        await navigator.clipboard.writeText(clipboardText);
        toast.success("Checklist data is ready to paste!");
    };

    const loading =
        Object.values(loadingChecklists).some((v) => v) &&
        Object.values(loadingTemplates).some((v) => v);

    return (
        <div className="h-full flex items-center justify-center p-4">
            <div className="flex flex-col bg-slate-800 rounded border border-slate-700 w-full max-w-5xl h-full max-h-125">
                <ChecklistHeader title={title} />

                <div className="flex flex-1 min-h-0">
                    <div className="flex flex-col h-full min-w-50 border-r border-slate-700 overflow-y-auto">
                        {types.map((type, index) => (
                            <button
                                key={type}
                                className={cn(
                                    "block p-2 border border-t-0 border-x-0 border-slate-700 hover:bg-slate-700 cursor-pointer transition",
                                    {
                                        "bg-slate-700": activeType === type,
                                    },
                                )}
                                onClick={() => setActiveType(type)}
                            >
                                {tabTitles[type]}
                            </button>
                        ))}
                    </div>
                    <div className="flex-1 p-2 overflow-y-auto">
                        {loading && <p className="text-gray-500">Loading...</p>}
                        {!loading && checklists[activeType] && (
                            <ul className="space-y-2">
                                {checklists[activeType].length === 0 && (
                                    <p className="text-gray-500">
                                        No items found.
                                    </p>
                                )}
                                {checklists[activeType].map((item, index) => (
                                    <li key={index}>
                                        <label className="inline-flex items-center gap-2 cursor-pointer">
                                            <Checkbox
                                                className="dark"
                                                checked={item.checked}
                                                value={item.text}
                                                onCheckedChange={(checked) =>
                                                    handleCheckChange(
                                                        checked,
                                                        index,
                                                    )
                                                }
                                            />
                                            {item.text}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="flex justify-end p-2 border-t border-slate-700">
                    <button
                        className="bg-slate-700 hover:bg-slate-900 text-white py-2 px-4 rounded cursor-pointer"
                        onClick={handleCopy}
                    >
                        Copy
                    </button>
                </div>
            </div>
        </div>
    );
}
