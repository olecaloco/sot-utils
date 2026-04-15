import { ChecklistUI } from "@/components/checklist";
import { MultiTabbedChecklist } from "@/components/checklist/multi";
import { ChecklistType, TraineeChecklistTypes } from "@/interfaces/Checklist";

export default async function TraineeChecklistPage() {
    return (
        <>
            <MultiTabbedChecklist
                title="Trainee Checklists"
                types={Object.values(TraineeChecklistTypes) as ChecklistType[]}
            />
        </>
    );
}
