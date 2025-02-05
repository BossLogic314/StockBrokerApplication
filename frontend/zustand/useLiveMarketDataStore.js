import { create } from "zustand";
import { usePlaceOrderDropdownStore } from './usePlaceOrderDropdownStore';

const liveMarketDataStore = (set, get) => ({
    liveMarketData: {},
    setLiveMarketData: (updatedLiveMarketData) => {

        let liveMarketDataCopy = get().liveMarketData;

        for (let i = 0; i < updatedLiveMarketData.length; ++i) {
            liveMarketDataCopy[updatedLiveMarketData[i].instrumentKey] = updatedLiveMarketData[i];

            if (updatedLiveMarketData[i].instrumentKey == usePlaceOrderDropdownStore.getState().orderingStock?.instrumentKey) {
                usePlaceOrderDropdownStore.setState({liveMarketDataOfOrderingStock: updatedLiveMarketData[i]});
            }
        }

        set({liveMarketData: liveMarketDataCopy});
    }
});

export const useLiveMarketDataStore = create(liveMarketDataStore);