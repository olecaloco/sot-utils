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
                    "trainee_cb_prestream",
                    "trainee_mts_prestream",
                    "trainee_phone_prestream",
                    "trainee_during_stream",
                    "trainee_poststream",
                ]}
            />
        </>
    );
}
