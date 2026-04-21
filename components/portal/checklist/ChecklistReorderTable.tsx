"use client";

import { useEffect, useState } from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
} from "@mui/material";
import { GripVerticalIcon } from "lucide-react";
import { Checklist } from "@/interfaces/Checklist";
import { useChecklists } from "@/contexts/ChecklistContextProvider";
import { updateChecklistOrder } from "@/services/checklist";
import { GROUP_LABELS } from "./constants";

// ---- Sortable Row ----
function SortableRow({ checklist }: { checklist: Checklist }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: checklist.id! });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: "grab",
    };

    return (
        <TableRow ref={setNodeRef} style={style}>
            <TableCell size="small" width={50}>
                <IconButton size="small" {...attributes} {...listeners}>
                    <GripVerticalIcon className="w-4 h-4" />
                </IconButton>
            </TableCell>
            <TableCell size="small">{checklist.title}</TableCell>
            <TableCell size="small">{GROUP_LABELS[checklist.group]}</TableCell>
        </TableRow>
    );
}

// ---- Main Component ----
export default function ChecklistsReorderTable() {
    const { checklists: serverChecklists } = useChecklists();

    const [checklists, setChecklists] = useState<Checklist[]>([]);

    useEffect(() => {
        setChecklists(serverChecklists);
    }, [serverChecklists]);

    const sensors = useSensors(useSensor(PointerSensor));

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = checklists.findIndex((p) => p.id === active.id);
        const newIndex = checklists.findIndex((p) => p.id === over.id);

        const newPosts = arrayMove(checklists, oldIndex, newIndex).map(
            (checklists, index) => ({
                ...checklists,
                order: index + 1,
            }),
        );

        updateChecklistOrder(newPosts);
        setChecklists(newPosts);
    }

    return (
        <div className="flex flex-col flex-1 px-4 py-2 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-xl font-semibold text-gray-300">
                        Re-order checklists
                    </h1>
                    <div className="text-sm text-gray-500">
                        Drag by the handles (
                        <GripVerticalIcon className="inline w-4" />) to re-order
                        the checklists
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <TableContainer>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={checklists.map((p) => p.id!)}
                        strategy={verticalListSortingStrategy}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell size="small" />
                                    <TableCell size="small">Title</TableCell>
                                    <TableCell size="small">Group</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {checklists.map((checklist) => (
                                    <SortableRow
                                        key={checklist.id}
                                        checklist={checklist}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </SortableContext>
                </DndContext>
            </TableContainer>
        </div>
    );
}
