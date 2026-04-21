export const ChecklistType = {
    TeamPrestream: "team_prestream",
    ModelPrestream: "model_prestream",
    PostStream: "poststream",
    TraineeStreamPrep: "trainee_stream_prep",
    TraineeTeamPrestream: "trainee_team_prestream",
    TraineeModelPrestream: "trainee_model_prestream",
    TraineeCBPrestream: "trainee_cb_prestream",
    TraineeMTSPrestream: "trainee_mts_prestream",
    TraineePhonePrestream: "trainee_phone_prestream",
    TraineeDuringStream: "trainee_during_stream",
    TraineeTroubleshooting: "trainee_troubleshooting",
    TraineePoststream: "trainee_poststream",
    TraineeFirstStream: "trainee_first_stream",
} as const;

export const RegularChecklistTypes = [
    ChecklistType.TeamPrestream,
    ChecklistType.ModelPrestream,
    ChecklistType.PostStream,
] as const;

export const TraineeChecklistTypes = [
    ChecklistType.TraineeStreamPrep,
    ChecklistType.TraineeTeamPrestream,
    ChecklistType.TraineeModelPrestream,
    ChecklistType.TraineeCBPrestream,
    ChecklistType.TraineeMTSPrestream,
    ChecklistType.TraineePhonePrestream,
    ChecklistType.TraineeDuringStream,
    ChecklistType.TraineeTroubleshooting,
    ChecklistType.TraineePoststream,
    ChecklistType.TraineeFirstStream
] as const;

export type ChecklistType = (typeof ChecklistType)[keyof typeof ChecklistType];

export interface ChecklistItem {
    text: string;
    checked: boolean;
}

export interface Checklist {
    id?: string;
    order?: number;
    title: string;
    items: ChecklistItem[];
    group: ChecklistGroup;
    template?: string;
}

export const ChecklistGroup = {
    Operations_Prestream: "operations_prestream",
    Operations_Poststream: "operations_poststream",
    Training: "training"
} as const;

export type ChecklistGroup = (typeof ChecklistGroup)[keyof typeof ChecklistGroup];