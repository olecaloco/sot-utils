"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { signInWithCustomToken, signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase-client";

export function useFirebaseAuth() {
    const { isSignedIn } = useAuth();

    useEffect(() => {
        const syncAuth = async () => {
            if (!isSignedIn) {
                await signOut(firebaseAuth);
                return;
            }

            const res = await fetch("/api/firebase-token");
            const data = await res.json();

            if (data.token) {
                await signInWithCustomToken(firebaseAuth, data.token);
            }
        };

        syncAuth();
    }, [isSignedIn]);
}
