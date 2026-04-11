"use client";

import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

export const FirebaseAuthWrap: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    useFirebaseAuth();

    return <>{children}</>;
};
