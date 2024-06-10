import { create } from "zustand";

const watchListStore = (set, get) => ({
    watchLists: [],
    setWatchLists: (newWatchLists) => set({watchLists: newWatchLists}),
    currentWatchList: null,
    setCurrentWatchList: (newCurrentWatchList) => set({currentWatchList: newCurrentWatchList}),
    currentWatchListIndex: 0,
    setCurrentWatchListIndex: (newCurrentWatchListIndex) => set({currentWatchListIndex: newCurrentWatchListIndex}),
    addStockToCurrentWatchList: (stock) => {

        let newCurrentWatchList = structuredClone(get().currentWatchList);
        for (let i = 0; i < newCurrentWatchList.stocks.length; ++i) {

            // If the stock is already present in the current watchlist
            if (newCurrentWatchList.stocks[i].instrumentKey == stock.instrumentKey) {
                return;
            }
        }
        newCurrentWatchList.stocks.push(stock);

        set({currentWatchList: newCurrentWatchList});
    },
    deleteStockFromCurrentWatchList: (stock) => {

        let newCurrentWatchList = structuredClone(get().currentWatchList);
        let newStocks = [];
        for (let i = 0; i < newCurrentWatchList.stocks.length; ++i) {

            // Stock to remove
            if (newCurrentWatchList.stocks[i].instrumentKey == stock.instrumentKey) {
                continue;
            }
            newStocks.push(newCurrentWatchList.stocks[i]);
        }
        newCurrentWatchList.stocks = newStocks;

        set({currentWatchList: newCurrentWatchList});
    }
});

export const useWatchListStore = create(watchListStore);