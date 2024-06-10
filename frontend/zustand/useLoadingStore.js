import { create } from "zustand";

const loadingStore = (set) => ({
    loading: true,
    setLoading: (updatedValue) => set({loading: updatedValue})
});

export const useLoadingStore = create(loadingStore);