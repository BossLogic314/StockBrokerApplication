import { create } from "zustand";

const placeOrderCautionMessageStore = (set) => ({
    showPlaceOrderCautionMessage: false,
    setShowPlaceOrderCautionMessage: (updatedValue) => set({showPlaceOrderCautionMessage: updatedValue}),
    orderDetails: null,
    setOrderDetails: (newOrderDetails) => set({orderDetails: newOrderDetails})
});

export const usePlaceOrderCautionMessageStore = create(placeOrderCautionMessageStore);