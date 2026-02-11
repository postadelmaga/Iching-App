import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Reading } from './types';

interface AppState {
    readings: Reading[];
    addReading: (reading: Reading) => void;
    deleteReading: (id: string) => void;
    currentReading: Reading | null;
    setCurrentReading: (reading: Reading | null) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            readings: [],
            addReading: (reading) => set((state) => ({ 
                readings: [reading, ...state.readings] 
            })),
            deleteReading: (id) => set((state) => ({
                readings: state.readings.filter(r => r.id !== id)
            })),
            currentReading: null,
            setCurrentReading: (reading) => set({ currentReading: reading }),
        }),
        {
            name: 'iching-storage',
        }
    )
);