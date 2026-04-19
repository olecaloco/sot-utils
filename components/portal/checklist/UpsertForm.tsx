"use client";

import { Checklist, ChecklistType } from "@/interfaces/Checklist";
import { db } from "@/lib/firebase-client";
import { upsertChecklist } from "@/services/checklist";
import Button from "@mui/material/Button";
import { doc, getDoc } from "firebase/firestore";
import { PlusIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { UpsertFormLoader } from "./FormLoader";
import { PORTAL_CHECKLIST_TITLES } from "./constants";

interface UpsertFormProps {
    name?: string;
    id: string | ChecklistType;
}

export default function UpsertForm(props: UpsertFormProps) {
    const [notExists, setNotExists] = useState(false);

    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<Checklist["items"]>([
        { text: "", checked: false },
    ]);

    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const pendingFocusIndex = useRef<number | null>(null);

    useEffect(() => {
        getDoc(doc(db, "checklists", props.id))
            .then((docSnap) => {
                if (!docSnap.exists()) {
                    setNotExists(true);
                    setLoading(false);
                    console.log("test");
                    return;
                }

                const data = docSnap.data() as Checklist | undefined;
                if (data && data.items.length > 0) {
                    setItems(data.items);
                }

                setLoading(false);
            })
            .catch((error) => {
                toast.error("Something went wrong fetching checklist");
                console.error(error);
            });
    }, [props.id]);

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

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const filtered = items.filter((item) => item.text);

        toast.promise(upsertChecklist(props.id, filtered), {
            loading: "Loading...",
            success: () => {
                return "Saved";
            },
            error: () => {
                return "Something went wrong";
            },
        });
    };

    if (loading) return <UpsertFormLoader />;

    if (notExists && !loading) {
        return (
            <div className="flex flex-col items-center justify-center px-4 py-2 h-full gap-4">
                <img
                    src="https://cdn.7tv.app/emote/01FC1B04XR000E3W5GESZFF1AY/2x.webp"
                    alt="Shrug"
                />
                <p className="text-zinc-700">Welp, this item is not found.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col px-4 py-2 h-full gap-4">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-xl font-semibold text-gray-300">
                        {PORTAL_CHECKLIST_TITLES[props.id as ChecklistType]}
                    </h1>
                    <div className="text-sm text-gray-500">
                        Add or update checklist items
                    </div>
                </div>
                <Button
                    size="small"
                    variant="contained"
                    form="checklist-form"
                    type="submit"
                >
                    Save
                </Button>
            </div>
            <div className="flex flex-col h-full overflow-y-auto">
                <form id="checklist-form" onSubmit={handleSubmit}>
                    {loading && <p className="text-gray-500">Loading...</p>}

                    {!loading &&
                        items.map((item, index) => (
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
