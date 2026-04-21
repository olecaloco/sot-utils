import { MultiTabbedChecklist } from "@/components/checklist/multi";

export default async function PreStreamChecklistPage() {
    return (
        <MultiTabbedChecklist
            title="Pre-stream Checklists"
            group={"operations_prestream"}
        />
    );
}
