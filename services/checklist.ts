"client only";

import { Checklist, ChecklistType } from "@/interfaces/Checklist";
import { db } from "@/lib/firebase-client";
import { doc, FirestoreError, setDoc, writeBatch } from "firebase/firestore";

export async function upsertChecklist(
    id: string,
    checklist: Checklist["items"],
): Promise<void> {
    try {
        const reference = doc(db, `checklists`, id);
        return await setDoc(reference, { items: checklist }, { merge: true });
    } catch (error) {
        if (error instanceof FirestoreError) {
            console.error("Firestore error:", error.code, error.message);
        } else {
            console.error("Unexpected error:", error);
        }
    }
}

export async function saveChecklistTemplate(contents: Partial<Record<ChecklistType, string>>): Promise<void> {
    try {
        const contentsArr = Object.values(ChecklistType);

        const batch = writeBatch(db);
        
        contentsArr
            .filter((type) => contents[type])
            .forEach(type => {
                const reference = doc(db, "checklistTemplate", type);
                batch.set(reference, { content: contents[type] }, { merge: true });
            });

        await batch.commit();
    } catch (error) {
        if (error instanceof FirestoreError) {
            console.error("Firestore error:", error.code, error.message);
        } else {
            console.error("Unexpected error:", error);
        }
    }
}
