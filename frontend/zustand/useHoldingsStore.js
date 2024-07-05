import { create } from "zustand";

const holdingsStore = (set, get) => ({
    holdings: [],
    setHoldings: (newHoldings) => set({holdings: newHoldings})
});

export const useHoldingsStore = create(holdingsStore);