import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
    userId: string | null;
    name: string | null;
    email: string | null;
    classCode: string | null;
}

interface LabSession {
    sessionId: string | null;
    labType: 'COD' | 'BOD' | 'WATER' | 'AIR' | null;
    currentStep: number;
    startTime: Date | null;
}

interface AppState {
    theme: 'light' | 'dark';
    toggleTheme: () => void;

    // User state
    user: UserState;
    setUser: (user: UserState) => void;
    clearUser: () => void;

    // Lab session state
    labSession: LabSession;
    setLabSession: (session: Partial<LabSession>) => void;
    clearLabSession: () => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            theme: 'light',
            toggleTheme: () => set((state) => {
                const newTheme = state.theme === 'light' ? 'dark' : 'light';
                if (newTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                return { theme: newTheme };
            }),

            // User state
            user: {
                userId: null,
                name: null,
                email: null,
                classCode: null,
            },
            setUser: (user) => set({ user }),
            clearUser: () => set({
                user: {
                    userId: null,
                    name: null,
                    email: null,
                    classCode: null,
                },
            }),

            // Lab session state
            labSession: {
                sessionId: null,
                labType: null,
                currentStep: 0,
                startTime: null,
            },
            setLabSession: (session) => set((state) => ({
                labSession: { ...state.labSession, ...session },
            })),
            clearLabSession: () => set({
                labSession: {
                    sessionId: null,
                    labType: null,
                    currentStep: 0,
                    startTime: null,
                },
            }),
        }),
        {
            name: 'env-lab-storage',
        }
    )
);
