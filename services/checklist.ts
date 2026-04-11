"client only";

import { Checklist, ChecklistType } from "@/interfaces/Checklist";
import { db } from "@/lib/firebase-client";
import {
    doc,
    FirestoreError,
    setDoc,
} from "firebase/firestore";


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