"use client";

import { Checklist, ChecklistType } from "@/interfaces/Checklist";
import { ChecklistHeader } from "./header";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";

const titles = {
    prestream: "Pre-Stream Checklist",
    poststream: "Post-Stream Checklist",
};

const template = `{title}

{items}
`;

export function ChecklistUI({ type }: { type: ChecklistType }) {
    const [loading, setLoading] = useState(false);
    const [checklist, setChecklist] = useState<Checklist["items"]>([]);

    useEffect(() => {
        onSnapshot(doc(db, "checklists", type), (snapshot) => {
            if (!snapshot.exists()) {
                setLoading(false);
                setChecklist([]);
                return;
            }

            const data = snapshot.data() as Checklist;
            setChecklist(data.items);
            setLoading(false);
        });
    }, []);

    const handleCheckChange = (checked: boolean, index: number) => {
        setChecklist((prev) => {
            const newChecklist = [...prev];
            newChecklist[index].checked = checked;
            return newChecklist;
        });
    };

    const handleCopy = async (): Promise<void> => {
        const text = checklist
            .map((item) => `${item.checked ? "✅" : "❌"} ${item.text}`)
            .join("\n");

        let clipboardText = template.replace("{items}", text);
        clipboardText = clipboardText.replace("{title}", titles[type]);

        await navigator.clipboard.writeText(clipboardText);
        toast.success("Checklist data is ready to paste!");
    };

    return (
        <div className="h-full flex items-center justify-center p-4">
            <div className="flex flex-col bg-slate-800 rounded border border-slate-700 w-full max-w-md h-full max-h-[500px]">
                <ChecklistHeader title={titles[type]} />
                <div className="flex-1 p-2 overflow-y-auto">
                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : (
                        <ul className="space-y-2">
                            {checklist.map((item, index) => (
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
                                        <span>{item.text}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="flex justify-end p-2 border-t border-slate-700">
                    <button
                        className="bg-slate-700 hover:bg-slate-900 text-white py-2 px-4 rounded cursor-pointer"
                        onClick={handleCopy}
                    >
                        Generate Slack message
                    </button>
                </div>
            </div>
        </div>
    );
}
