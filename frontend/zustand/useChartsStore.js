import { create } from "zustand";

const chartsStore = (set) => ({
    currentStock: null,
    setCurrentStock: (newCurrentStock) => set({currentStock: newCurrentStock}),
    currentOption: 'Charts',
    setCurrentOption: (newCurrentOption) => set({currentOption: newCurrentOption}),
    currentScale: '1 min',
    setCurrentScale: (newCurrentScale) => set({currentScale: newCurrentScale})
});

export const useChartsStore = create(chartsStore);