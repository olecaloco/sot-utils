import { ChecklistUI } from "@/components/checklist";
import { MultiTabbedChecklist } from "@/components/checklist/multi";

export default async function TraineeChecklistPage() {
    return (
        <>
            <MultiTabbedChecklist
                title="Trainee Checklists"
                types={[
                    "trainee_stream_prep",
                    "trainee_team_prestream",
                    "trainee_model_prestream",
                    "trainee_during_stream",
                    "trainee_poststream",
                ]}
            />
            {/* <ChecklistUI type="trainee_stream_prep" />
            <ChecklistUI type="trainee_team_prestream" />
            <ChecklistUI type="trainee_model_prestream" />
            <ChecklistUI type="trainee_during_stream" />
            <ChecklistUI type="trainee_poststream" /> */}
        </>
    );
}
