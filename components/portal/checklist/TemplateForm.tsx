"use client";
import {
    ChecklistType,
    RegularChecklistTypes,
    TraineeChecklistTypes,
} from "@/interfaces/Checklist";
import { db } from "@/lib/firebase-client";
import { saveChecklistTemplate } from "@/services/checklist";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const labels: Record<ChecklistType, string> = {
    team_prestream: "Team Pre-stream",
    model_prestream: "Model Pre-stream",
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
        poststream: defaultTemplates(),
        trainee_stream_prep: defaultTemplates(),
        trainee_team_prestream: defaultTemplates(),
        trainee_during_stream: defaultTemplates(),
        trainee_model_prestream: defaultTemplates(),
        trainee_cb_prestream: defaultTemplates(),
        trainee_mts_prestream: defaultTemplates(),
        trainee_phone_prestream: defaultTemplates(),
        trainee_troubleshooting: defaultTemplates(),
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

        const contentsToSave: Partial<Record<ChecklistType, string>> = {
            ...contents,
        };

        if (type === "regular") {
            delete contentsToSave.trainee_during_stream;
            delete contentsToSave.trainee_model_prestream;
            delete contentsToSave.trainee_cb_prestream;
            delete contentsToSave.trainee_mts_prestream;
            delete contentsToSave.trainee_phone_prestream;
            delete contentsToSave.trainee_poststream;
            delete contentsToSave.trainee_team_prestream;
            delete contentsToSave.trainee_stream_prep;
            delete contentsToSave.trainee_troubleshooting;
        } else if (type === "trainee") {
            delete contentsToSave.team_prestream;
            delete contentsToSave.model_prestream;
            delete contentsToSave.poststream;
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
            <Paper>
                <Tabs
                    value={mode}
                    variant="scrollable"
                    scrollButtons="auto"
                    onChange={(_, value) => {
                        setMode(value);
                    }}
                >
                    {FilteredChecklistTypes.map((type) => (
                        <Tab key={type} value={type} label={labels[type]} />
                    ))}
                </Tabs>
            </Paper>

            <div className="grid grid-cols-2 gap-4 items-stretch">
                <div className="flex flex-col">
                    <label className="mb-2">
                        {labels[mode] || mode} Template
                    </label>
                    <textarea
                        name={mode}
                        className="flex-1 min-h-75 p-2 rounded border border-zinc-800  text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f89f8e] text-sm resize-none"
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
                    <Paper className="flex-1 min-h-75 overflow-auto p-4 rounded text-gray-200 whitespace-pre-wrap">
                        {renderedPreview}
                    </Paper>
                </div>
            </div>
        </form>
    );
};
