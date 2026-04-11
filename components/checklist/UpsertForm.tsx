"use client";

import { Checklist, ChecklistType } from "@/interfaces/Checklist";
import { db } from "@/lib/firebase-client";
import { upsertChecklist } from "@/services/checklist";
import { cn } from "@/utils";
import { doc, onSnapshot } from "firebase/firestore";
import { PlusIcon, X, XIcon } from "lucide-react";
import { ChangeEvent, SubmitEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface UpsertFormProps {
    name?: string;
    type: ChecklistType;
}

export default function UpsertForm(props: UpsertFormProps) {
    const [items, setItems] = useState<Checklist["items"]>([
        { text: "", checked: false },
    ]);

    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const pendingFocusIndex = useRef<number | null>(null);

    useEffect(() => {
        const unsub = onSnapshot(
            doc(db, "checklists", props.type),
            (snapshot) => {
                const data = snapshot.data() as Checklist | undefined;
                if (data) {
                    setItems(data.items);
                }
            },
        );

        return () => unsub();
    }, [props.type]);

    const setInputRef =
        (index: number) =>
        (el: HTMLInputElement | null): void => {
            inputRefs.current[index] = el;
        };

    // 🔥 reliable focus AFTER render
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
                const nextIndex = Math.min(index, items.length - 2); // move down if possible
                pendingFocusIndex.current = nextIndex;

                setItems(items.filter((_, i) => i !== index));
            }

            return;
        }
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const filtered = items.filter((item) => item.text);

        toast.promise(upsertChecklist(props.type, filtered), {
            loading: "Loading...",
            success: () => {
                return "Saved";
            },
            error: () => {
                return "Something went wrong";
            },
        });
    };

    return (
        <div className="flex flex-col h-full">
            <form id="checklist-form" onSubmit={handleSubmit}>
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="group flex items-center py-1 border-y border-transparent hover:border-gray-800 focus-within:border-gray-800 transition"
                    >
                        <input
                            ref={setInputRef(index)}
                            value={item.text}
                            onChange={(e) =>
                                handleChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            placeholder="List item"
                            className="flex-1 bg-transparent outline-none placeholder-gray-400"
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
    );
}
