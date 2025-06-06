'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, GoogleAuthProvider, signOut, User, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebaseClient';

type AuthContextType = {
    user: User | null;
    signIn: () => Promise<void>;
    logOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Handle redirect result and save user data to Firestore
        const handleRedirect = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result?.user) {
                    setUser(result.user);
                    console.log('User signed in via redirect:', result.user);
                    // Save user data to Firestore
                    const userData = {
                        uid: result.user.uid,
                        displayName: result.user.displayName,
                        email: result.user.email,
                        photoURL: result.user.photoURL,
                        lastLogin: new Date().toISOString(),
                    };
                    await setDoc(doc(db, 'users', result.user.uid), userData, { merge: true });
                    console.log('User data saved to Firestore:', userData);
                }
            } catch (error) {
                console.error('Redirect sign-in or Firestore save error:', error);
            }
        };

        handleRedirect();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                // Save user data to Firestore on auth state change
                const userData = {
                    uid: firebaseUser.uid,
                    displayName: firebaseUser.displayName,
                    email: firebaseUser.email,
                    photoURL: firebaseUser.photoURL,
                    lastLogin: new Date().toISOString(),
                };
                try {
                    await setDoc(doc(db, 'users', firebaseUser.uid), userData, { merge: true });
                    console.log('User data updated in Firestore:', userData);
                } catch (error) {
                    console.error('Firestore save error:', error);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    const signIn = async () => {
        const provider = new GoogleAuthProvider();
        provider.addScope('email');
        await signInWithRedirect(auth, provider);
    };

    const logOut = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, signIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}