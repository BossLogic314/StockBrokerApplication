import { create } from "zustand";

const userDataStore = (set) => ({
    userData: null,
    setUserData: (newUserData) => set({userData: newUserData})
});

export const useUserDataStore = create(userDataStore);