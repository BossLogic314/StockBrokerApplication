import { create } from "zustand";

const liveMarketDataStore = (set, get) => ({
    liveMarketData: {},
    setLiveMarketData: (updatedLiveMarketData) => {

        let liveMarketDataCopy = get().liveMarketData;

        for (let i = 0; i < updatedLiveMarketData.length; ++i) {
            liveMarketDataCopy[updatedLiveMarketData[i].instrumentKey] = updatedLiveMarketData[i];
        }

        set({liveMarketData: liveMarketDataCopy});
    }
});

export const useLiveMarketDataStore = create(liveMarketDataStore);