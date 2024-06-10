import { create } from "zustand";

const addScripDropdownStore = (set) => ({
    displayAddScripsDropdown: false,
    setDisplayAddScripsDropdown: (updatedValue) => set({displayAddScripsDropdown: updatedValue})
});

export const useAddScripDropdownStore = create(addScripDropdownStore);