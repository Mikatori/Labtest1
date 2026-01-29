import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

// Extended user profile interface
export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    classCode?: string;
    createdAt?: Date;
}

interface AuthContextType {
    currentUser: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, displayName: string, classCode: string) => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch user profile from Firestore
    const fetchUserProfile = async (user: User): Promise<UserProfile | null> => {
        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                return {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    classCode: data.classCode,
                    createdAt: data.createdAt?.toDate(),
                };
            }
            return {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
            };
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
            };
        }
    };

    // Register new user
    const register = async (email: string, password: string, displayName: string, classCode: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update user profile with display name
        await updateProfile(user, { displayName });

        // Store additional user data in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            email,
            displayName,
            classCode,
            createdAt: new Date(),
        });
    };

    // Login existing user
    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    // Logout user
    const logout = async () => {
        await signOut(auth);
        setUserProfile(null);
    };

    // Send password reset email
    const resetPassword = async (email: string) => {
        await sendPasswordResetEmail(auth, email);
    };

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                const profile = await fetchUserProfile(user);
                setUserProfile(profile);
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value: AuthContextType = {
        currentUser,
        userProfile,
        loading,
        login,
        register,
        logout,
        resetPassword,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
