import { create } from "zustand";

const placeOrderDropdownStore = (set) => ({
    toBuy: false,
    setToBuy: (newToBuy) => set({toBuy: newToBuy}),
    orderingStock: null,
    setOrderingStock: (newOrderingStock) => set({orderingStock: newOrderingStock}),
    liveMarketDataOfOrderingStock: null,
    setLiveMarketDataOfOrderingStock: (updatedValue) => set({liveMarketDataOfOrderingStock: updatedValue}),
    displayPlaceOrderDropdown: false,
    setDisplayPlaceOrderDropdown: (updatedValue) => set({displayPlaceOrderDropdown: updatedValue})
});

export const usePlaceOrderDropdownStore = create(placeOrderDropdownStore);