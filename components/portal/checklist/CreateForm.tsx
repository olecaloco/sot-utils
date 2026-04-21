"use client";

import { Checklist, ChecklistGroup } from "@/interfaces/Checklist";
import { addChecklist } from "@/services/checklist";
import Button from "@mui/material/Button";
import { PlusIcon, XIcon } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { GROUP_LABELS } from "./constants";
import FormGroup from "@mui/material/FormGroup";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/navigation";
import { useChecklists } from "@/contexts/ChecklistContextProvider";

export default function CreateChecklistForm() {
    const router = useRouter();
    const { checklists } = useChecklists();

    const [title, setTitle] = useState<string>("");
    const [group, setGroup] = useState<ChecklistGroup>("operations_prestream");
    const [items, setItems] = useState<Checklist["items"]>([
        { text: "", checked: false },
    ]);

    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const pendingFocusIndex = useRef<number | null>(null);

    const setInputRef =
        (index: number) =>
        (el: HTMLInputElement | null): void => {
            inputRefs.current[index] = el;
        };

    useEffect(() => {
        if (pendingFocusIndex.current !== null) {
            inputRefs.current[pendingFocusIndex.current]?.focus();
            pendingFocusIndex.current = null;
        }
    }, [items]);

    const handleChange = (index: number, value: string) => {
        const updated = [...items];
        updated[index].text = value;
        setItems(updated);
    };

    const addItem = (index = items.length - 1) => {
        const updated = [...items];
        updated.splice(index + 1, 0, { text: "", checked: false });

        pendingFocusIndex.current = index + 1;
        setItems(updated);
    };

    const deleteItem = (index: number) => {
        if (items.length === 1) return;

        const updated = items.filter((_, i) => i !== index);

        const nextIndex = index > 0 ? index - 1 : 0;
        pendingFocusIndex.current = nextIndex;

        setItems(updated);
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addItem(index);
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            const next = index + 1;
            if (next < items.length) {
                inputRefs.current[next]?.focus();
            }
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            const prev = index - 1;
            if (prev >= 0) {
                inputRefs.current[prev]?.focus();
            }
        }

        if (e.key === "Backspace" && items[index].text === "") {
            e.preventDefault();

            if (items.length > 1) {
                deleteItem(index);
            }

            return;
        }

        if (e.key === "Delete" && items[index].text === "") {
            e.preventDefault();

            if (items.length > 1) {
                const nextIndex = Math.min(index, items.length - 2);
                pendingFocusIndex.current = nextIndex;

                setItems(items.filter((_, i) => i !== index));
            }

            return;
        }
    };

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        setTitle(value);
    };

    const handleGroupChange = (e: SelectChangeEvent): void => {
        const value = e.target.value as ChecklistGroup;
        setGroup(value);
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const filteredItems = items.filter((item) => item.text);

        const data: Checklist = {
            title,
            group,
            items: filteredItems,
            order: checklists.length + 1,
        };

        toast.promise(addChecklist(data), {
            loading: "Loading...",
            success: (response) => {
                if (response.success)
                    router.push(`/portal/checklists/${response.id}`);
                return "Saved";
            },
            error: () => {
                return "Something went wrong";
            },
        });
    };

    return (
        <div className="flex flex-col flex-1 px-4 py-2 h-full gap-4">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-xl font-semibold text-gray-300">
                        Create a checklist
                    </h1>
                </div>
                <Button
                    size="small"
                    variant="contained"
                    form="create-checklist-form"
                    type="submit"
                >
                    Save
                </Button>
            </div>
            <div className="flex flex-col h-full overflow-y-auto">
                <form id="create-checklist-form" onSubmit={handleSubmit}>
                    <FormGroup className="w-full max-w-75 pt-2 mb-4">
                        <InputLabel className="mb-1">Title</InputLabel>
                        <TextField
                            size="small"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="e.g. Model post stream"
                            required
                        />
                    </FormGroup>

                    <FormGroup className="w-full max-w-75 pt-2 mb-4">
                        <InputLabel className="mb-1">Group</InputLabel>
                        <Select
                            size="small"
                            value={group}
                            onChange={handleGroupChange}
                            required
                        >
                            {Object.values(ChecklistGroup).map((g) => (
                                <MenuItem key={g} value={g}>
                                    {GROUP_LABELS[g]}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormGroup>

                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="pr-5 group flex items-center py-1 border-y border-transparent hover:border-gray-800 focus-within:border-gray-800 transition"
                        >
                            <input
                                ref={setInputRef(index)}
                                value={item.text}
                                onChange={(e) =>
                                    handleChange(index, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                placeholder="List item"
                                className="flex-1 bg-transparent outline-none placeholder-gray-400 text-gray-300"
                            />

                            <button
                                type="button"
                                onClick={() => deleteItem(index)}
                                className="ml-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
                 text-gray-400 hover:text-red-500 transition"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </form>

                <button
                    type="button"
                    onClick={() => addItem()}
                    className="flex gap-2 items-center mt-3 py-1 text-sm text-gray-500 hover:text-gray-300 cursor-pointer"
                >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add item</span>
                </button>
            </div>
        </div>
    );
}
