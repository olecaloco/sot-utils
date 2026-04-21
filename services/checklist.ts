"client only";

import { Checklist } from "@/interfaces/Checklist";
import { db } from "@/lib/firebase-client";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    FirestoreError,
    setDoc,
    writeBatch,
} from "firebase/firestore";

export async function updateChecklist(
    id: string,
    checklist: Checklist,
): Promise<void> {
    try {
        const reference = doc(db, `checklists`, id);
        return await setDoc(reference, checklist, { merge: true });
    } catch (error) {
        if (error instanceof FirestoreError) {
            console.error("Firestore error:", error.code, error.message);
        } else {
            console.error("Unexpected error:", error);
        }
    }
}

export async function addChecklist(
    checklist: Checklist,
): Promise<{ success: boolean; id?: string }> {
    try {
        const reference = collection(db, `checklists`);
        const document = await addDoc(reference, checklist);

        return {
            id: document.id,
            success: true,
        };
    } catch (error) {
        if (error instanceof FirestoreError) {
            console.error("Firestore error:", error.code, error.message);
        } else {
            console.error("Unexpected error:", error);
        }

        return {
            success: false,
        };
    }
}

export async function deleteChecklist(
    id: string,
): Promise<{ success: boolean }> {
    try {
        const reference = doc(db, `checklists`, id);
        await deleteDoc(reference);

        return {
            success: true,
        };
    } catch (error) {
        if (error instanceof FirestoreError) {
            console.error("Firestore error:", error.code, error.message);
        } else {
            console.error("Unexpected error:", error);
        }

        return {
            success: false,
        };
    }
}

export async function saveChecklistsTemplates(
    checklists: Checklist[],
): Promise<void> {
    try {
        const batch = writeBatch(db);

        checklists.forEach((d) => {
            const reference = doc(db, "checklists", d.id!);
            batch.set(reference, { template: d.template }, { merge: true });
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

export async function updateChecklistOrder(
    checklists: Checklist[],
): Promise<{ success: boolean }> {
    try {
        const batch = writeBatch(db);

        checklists.forEach((c) => {
            const reference = doc(db, "checklists", c.id!);
            batch.set(reference, { order: c.order }, { merge: true });
        });

        await batch.commit();

        return { success: true };
    } catch (error) {
        if (error instanceof FirestoreError) {
            console.error("Firestore error:", error.code, error.message);
        } else {
            console.error("Unexpected error:", error);
        }

        return { success: false };
    }
}
