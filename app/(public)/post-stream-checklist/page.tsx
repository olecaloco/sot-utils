import { MultiTabbedChecklist } from "@/components/checklist/multi";

export default async function PostStreamChecklistPage() {
    return (
        <MultiTabbedChecklist
            title="Post-Stream Checklists"
            group={"operations_poststream"}
        />
    );
}
