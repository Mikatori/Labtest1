import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    // Progress tracking can be added here
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
        }),
        {
            name: 'env-lab-storage',
        }
    )
);
