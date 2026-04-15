export const ChecklistType = {
  TeamPrestream: "team_prestream",
  ModelPrestream: "model_prestream",
  TeamPoststream: "team_poststream",
  ModelPoststream: "model_poststream",
  TraineeStreamPrep: "trainee_stream_prep",
  TraineeTeamPrestream: "trainee_team_prestream",
  TraineeModelPrestream: "trainee_model_prestream",
  TraineeCBPrestream: "trainee_cb_prestream",
  TraineeMTSPrestream: "trainee_mts_prestream",
  TraineePhonePrestream: "trainee_phone_prestream",
  TraineeDuringStream: "trainee_during_stream",
  TraineeTroubleshooting: "trainee_troubleshooting",
  TraineePoststream: "trainee_poststream",
} as const;

export const RegularChecklistTypes = [
  ChecklistType.TeamPrestream,
  ChecklistType.ModelPrestream,
  ChecklistType.TeamPoststream,
  ChecklistType.ModelPoststream,
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
] as const;

export type ChecklistType = typeof ChecklistType[keyof typeof ChecklistType];

export interface ChecklistItem {
    text: string;
    checked: boolean;
}

export interface Checklist {
    items: ChecklistItem[];
};