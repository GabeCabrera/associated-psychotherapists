import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Therapist {
    id: number;
    title: string;
    chips: Array<string>;
    description: string;
    avatar: string;
}

interface TherapistStore {
    therapist: Therapist;
    setTherapist: (therapist: Therapist) => void;
}

export const useTherapistStore = create<TherapistStore>()(
    persist(
        (set: any) => ({
            therapist: { id: 0, title: '', chips: [] as string[], description: '', avatar: '' },
            setTherapist: (therapist: Therapist) => set((state: TherapistStore) => ({ therapist: { ...state.therapist, ...therapist } })),
        }),
        {
            name: 'therapist-storage', // unique name
            storage: createJSONStorage(() => localStorage), // storage method
        }
    )
);