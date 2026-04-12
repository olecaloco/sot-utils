"use client";
import {
    ChecklistType,
    RegularChecklistTypes,
    TraineeChecklistTypes,
} from "@/interfaces/Checklist";
import { db } from "@/lib/firebase-client";
import { saveChecklistTemplate } from "@/services/checklist";
import { cn } from "@/utils";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const labels: Record<ChecklistType, string> = {
    team_prestream: "Team Pre-Stream",
    model_prestream: "Model Pre-Stream",
    team_poststream: "Team Post-Stream",
    model_poststream: "Model Post-Stream",
    trainee_stream_prep: "Trainee Stream Prep",
    trainee_team_prestream: "Trainee Team Pre-Stream",
    trainee_during_stream: "Trainee During Stream",
    trainee_model_prestream: "Trainee Model Pre-Stream",
    trainee_poststream: "Trainee Post-Stream",
};

const defaultTemplates = () => {
    return `Checklist Title

{items}`.trim();
};

export const ChecklistTemplateForm = ({
    type,
}: {
    type: "regular" | "trainee";
}) => {
    const [mode, setMode] = useState<ChecklistType>(
        type === "regular" ? "team_prestream" : "trainee_stream_prep",
    );

    const [contents, setContents] = useState<Record<ChecklistType, string>>({
        team_prestream: defaultTemplates(),
        model_prestream: defaultTemplates(),
        team_poststream: defaultTemplates(),
        model_poststream: defaultTemplates(),
        trainee_stream_prep: defaultTemplates(),
        trainee_team_prestream: defaultTemplates(),
        trainee_during_stream: defaultTemplates(),
        trainee_model_prestream: defaultTemplates(),
        trainee_poststream: defaultTemplates(),
    });

    const currentContent = contents[mode];

    const renderedPreview = currentContent.replace(
        /{items}/g,
        `✅ Sample Item 1
❌ Sample Item 2`,
    );

    useEffect(() => {
        // Fetch templates
        const fetchTemplates = async () => {
            const keys = Object.values(ChecklistType);
            keys.forEach(async (key) => {
                getDoc(doc(db, "checklistTemplate", key)).then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.data() as { content: string };
                        setContents((prev) => ({
                            ...prev,
                            [key]: data.content,
                        }));
                    }
                });
            });
        };

        fetchTemplates();
    }, []);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const contentsToSave: any = { ...contents };

        if (type === "regular") {
            delete contentsToSave.trainee_during_stream;
            delete contentsToSave.trainee_model_prestream;
            delete contentsToSave.trainee_poststream;
            delete contentsToSave.trainee_team_prestream;
            delete contentsToSave.trainee_stream_prep;
        } else if (type === "trainee") {
            delete contentsToSave.team_prestream;
            delete contentsToSave.team_poststream;
            delete contentsToSave.model_prestream;
            delete contentsToSave.model_poststream;
        }

        toast.promise(saveChecklistTemplate(contentsToSave), {
            loading: "Saving templates...",
            success: "Templates saved successfully!",
            error: "Failed to save templates.",
        });
    };

    const FilteredChecklistTypes =
        type === "regular" ? RegularChecklistTypes : TraineeChecklistTypes;

    return (
        <form
            id="checklist-template-form"
            onSubmit={handleSubmit}
            className="space-y-4"
        >
            {/* Toggle */}
            <div className="flex rounded bg-slate-700 p-1 w-fit text-sm">
                {FilteredChecklistTypes.map((type) => (
                    <button
                        key={type}
                        type="button"
                        onClick={() => setMode(type)}
                        className={cn("px-4 py-1 rounded cursor-pointer", {
                            "bg-slate-900 text-white": mode === type,
                            "text-gray-300": mode !== type,
                        })}
                    >
                        {labels[type] || type}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4 items-stretch">
                <div className="flex flex-col">
                    <label className="mb-2">
                        {labels[mode] || mode} Template
                    </label>
                    <textarea
                        name={mode}
                        className="flex-1 min-h-75 p-2 rounded border border-gray-800  text-gray-300 font-mono resize-none"
                        value={currentContent}
                        onChange={(e) =>
                            setContents((prev) => ({
                                ...prev,
                                [mode]: e.target.value,
                            }))
                        }
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-2">Preview</label>
                    <div className="flex-1 min-h-75 overflow-auto p-4 rounded bg-slate-800 text-gray-200 whitespace-pre-wrap">
                        {renderedPreview}
                    </div>
                </div>
            </div>
        </form>
    );
};
