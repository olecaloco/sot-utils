export type ChecklistType = "prestream" | "poststream";

export interface ChecklistItem {
    text: string;
    checked: boolean;
}

export interface Checklist {
    items: ChecklistItem[];
};