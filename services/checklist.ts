"client only";

import { Checklist, ChecklistType } from "@/interfaces/Checklist";
import { db } from "@/lib/firebase-client";
import { doc, FirestoreError, setDoc } from "firebase/firestore";

export async function upsertChecklist(
    type: ChecklistType,
    checklist: Checklist["items"],
): Promise<void> {
    try {
        const reference = doc(db, `checklists`, type);
        return await setDoc(reference, { items: checklist }, { merge: true });
    } catch (error) {
        if (error instanceof FirestoreError) {
            console.error("Firestore error:", error.code, error.message);
        } else {
            console.error("Unexpected error:", error);
        }
    }
}

export async function saveChecklistTemplate(contents: { [key in ChecklistType]: string }): Promise<void> {
    try {
        const contentsArr = Object.values(ChecklistType);
        
        const requests = contentsArr
            .filter((type) => contents[type])
            .map((type) => {
                const reference = doc(db, `checklistTemplate`, type);
                return setDoc(reference, { content: contents[type] }, { merge: true });
            });

        await Promise.all(requests);
    } catch (error) {
        if (error instanceof FirestoreError) {
            console.error("Firestore error:", error.code, error.message);
        } else {
            console.error("Unexpected error:", error);
        }
    }
}
