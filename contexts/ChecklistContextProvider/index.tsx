"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { Checklist } from "@/interfaces/Checklist";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase-client";

interface ChecklistContextProps {
    checklists: Checklist[];
    isFetchingChecklists: boolean;
}

export const ChecklistContext = createContext<ChecklistContextProps>(
    {} as ChecklistContextProps,
);

interface ChecklistContextProviderProps {
    children?: React.ReactNode;
}

export const ChecklistContextProvider = (
    props: ChecklistContextProviderProps,
) => {
    const { children } = props;

    const [checklists, setChecklists] = useState<Checklist[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const q = query(collection(db, "checklists"), orderBy("order", "asc"));

        onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                setChecklists([]);
                setLoading(false);
                return;
            }

            const data = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            })) as Checklist[];

            setChecklists(data);
            setLoading(false);
        });
    }, []);

    const value = useMemo(
        () => ({
            checklists,
            isFetchingChecklists: loading,
        }),
        [checklists, loading],
    );

    return (
        <ChecklistContext.Provider value={value}>
            {children}
        </ChecklistContext.Provider>
    );
};

export const useChecklists = () => useContext(ChecklistContext);
