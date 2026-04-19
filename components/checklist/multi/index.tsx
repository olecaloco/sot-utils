"use client";

import { Checklist, ChecklistType } from "@/interfaces/Checklist";
import { ChecklistHeader } from "../header";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { toast } from "sonner";
import Divider from "@mui/material/Divider";
import { ChecklistFooter } from "../footer";
import { MultiChecklistTabs } from "./tabs";
import { MultiChecklistItems } from "./items";

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

    console.log(checklists);

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
        <div className="flex flex-col w-full h-dvh">
            <ChecklistHeader title={title} />
            <Divider />

            <div className="flex flex-1 min-h-0">
                <MultiChecklistTabs
                    types={types}
                    activeType={activeType}
                    setActiveType={setActiveType}
                />

                <Divider orientation={"vertical"} />

                <MultiChecklistItems
                    activeType={activeType}
                    loading={loading}
                    checklists={checklists}
                    handleCheckChange={handleCheckChange}
                />
            </div>

            <Divider />

            <ChecklistFooter handleCopy={handleCopy} />
        </div>
    );
}
