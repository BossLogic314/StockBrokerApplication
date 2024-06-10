import { create } from "zustand";

const showDeleteWatchListWarningStore = (set) => ({
    showDeleteWatchListWarning: false,
    setShowDeleteWatchListWarning: (updatedValue) => set({showDeleteWatchListWarning: updatedValue})
});

export const useShowDeleteWatchListWarningStore = create(showDeleteWatchListWarningStore);