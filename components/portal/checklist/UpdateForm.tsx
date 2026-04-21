"use client";

import {
    Checklist,
    ChecklistGroup,
    ChecklistType,
} from "@/interfaces/Checklist";
import { deleteChecklist, updateChecklist } from "@/services/checklist";
import Button from "@mui/material/Button";
import { PlusIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/navigation";
import { useChecklists } from "@/contexts/ChecklistContextProvider";
import { TextField } from "@mui/material";

interface UpdateChecklistFormProps {
    name?: string;
    id: string | ChecklistType;
}

export default function UpdateChecklistForm(props: UpdateChecklistFormProps) {
    const { checklists, isFetchingChecklists } = useChecklists();
    const router = useRouter();

    const [notExists, setNotExists] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const [title, setTitle] = useState<string>("");
    const [group, setGroup] = useState<ChecklistGroup>("operations_prestream");
    const [items, setItems] = useState<Checklist["items"]>([
        { text: "", checked: false },
    ]);

    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const pendingFocusIndex = useRef<number | null>(null);

    useEffect(() => {
        if (isFetchingChecklists) return;

        const _checklist = checklists.find((c) => c.id === props.id);
        if (!_checklist) {
            setNotExists(true);
            setLoading(false);
            return;
        }

        setTitle(_checklist.title);
        setItems(_checklist.items);
        setGroup(_checklist.group);
        setNotExists(false);
        setLoading(false);
    }, [props.id, checklists, isFetchingChecklists]);

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

    const handleDelete = () => {
        const confirmed = confirm(`Are you sure you want to delete ${title}`);

        if (confirmed) {
            toast.promise(deleteChecklist(props.id), {
                loading: "Loading...",
                success: (response) => {
                    if (response.success) router.replace("/portal");
                    return `${title} has been deleted`;
                },
                error: () => {
                    return "Something went wrong";
                },
            });
        }
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const filtered = items.filter((item) => item.text);

        const data: Checklist = {
            title: title,
            group: group,
            items: filtered,
        };

        toast.promise(updateChecklist(props.id, data), {
            loading: "Loading...",
            success: () => {
                return "Saved";
            },
            error: () => {
                return "Something went wrong";
            },
        });
    };

    if (notExists) {
        return (
            <div className="flex flex-col items-center justify-center px-4 py-2 h-full gap-4">
                <Image
                    src="https://cdn.7tv.app/emote/01FC1B04XR000E3W5GESZFF1AY/2x.webp"
                    alt="Shrug"
                    width={66}
                    height={64}
                />
                <p className="text-zinc-700">Welp, this item is not found.</p>
            </div>
        );
    }

    return (
        <form
            className="flex flex-col flex-1 px-4 py-2 h-full gap-4"
            id="update-checklist-form"
            onSubmit={handleSubmit}
        >
            <div className="flex items-center justify-between mb-2">
                <div>
                    <TextField
                        value={title}
                        variant={"standard"}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Model pre stream"
                        required
                    />
                    <div className="text-sm text-gray-500">
                        Add or update checklist items
                    </div>
                </div>
                <Stack spacing={1} direction={"row"}>
                    <Button
                        size="small"
                        variant="text"
                        color="error"
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        Delete
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        form="update-checklist-form"
                        type="submit"
                        disabled={loading}
                    >
                        Save
                    </Button>
                </Stack>
            </div>
            <div className="flex flex-col h-full overflow-y-auto">
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

                <button
                    type="button"
                    onClick={() => addItem()}
                    className="flex gap-2 items-center mt-3 py-1 text-sm text-gray-500 hover:text-gray-300 cursor-pointer"
                >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add item</span>
                </button>
            </div>
        </form>
    );
}
