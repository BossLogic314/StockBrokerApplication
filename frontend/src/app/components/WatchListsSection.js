"use client";
import { useEffect, useState } from 'react';
import { useUserDataStore } from '../../../zustand/useUserDataStore';
import { useLoadingStore } from '../../../zustand/useLoadingStore';
import { useAddScripDropdownStore } from '../../../zustand/useAddScripDropdownStore';
import { useCurrentWatchListStore } from '../../../zustand/useCurrentWatchListStore';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import AddScriptDropdown from './AddScripDropdown';
import './styles/WatchListsSection.css';

export default function WatchListsSection() {

    const {userData, setUserData} = useUserDataStore();
    const {loading, setLoading} = useLoadingStore();
    const [watchLists, setWatchLists] = useState([]);
    const {currentWatchList, setCurrentWatchList, currentWatchListIndex, setCurrentWatchListIndex, deleteStockFromCurrentWatchList} = useCurrentWatchListStore();
    const [hoveringStockIndex, setHoveringStockIndex] = useState(-1);
    const {displayAddScripsDropdown, setDisplayAddScripsDropdown} = useAddScripDropdownStore();
    const router = useRouter();

    const getWatchLists = (async () => {

        // If the user data has not loaded yet
        if (loading) {
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8087/watchLists/getWatchLists?userId=${userData.user_id}`,
            {
                withCredentials: true
            });
            setWatchLists(response.data.watchLists.watchLists);
        }
        // The user needs to login again
        catch(error) {
            router.replace('/');
        }
    });

    const watchListClicked = (event) => {
        const index = event.target.getAttribute('index');
        setCurrentWatchListIndex(index);
        setCurrentWatchList(watchLists[index]);
    }

    const addScripButtonClicked = (event) => {
        setDisplayAddScripsDropdown(true);
    }

    const hoveringOnStock = (event) => {
        const index = event.target.getAttribute('index');
        setHoveringStockIndex(index);
    }

    const notHoveringOnStock = (event) => {
        setHoveringStockIndex(null);
    }

    const buyStock = (event) => {
        console.log(hoveringStockIndex);
    }

    const sellStock = (event) => {
        console.log(hoveringStockIndex);
    }

    const deleteStockFromWatchList = (event) => {
        deleteStockFromCurrentWatchList(currentWatchList.stocks[hoveringStockIndex]);
        setHoveringStockIndex(null);
    }

    useEffect(() => {

        getWatchLists();
    }, [loading]);

    return (
        <div className="watchListsSection h-full w-[340px] min-w-[340px] border-black border-[1px]">
            <div className="stockExchangesStatsSection flex flex-row">
                <div className="niftySection h-[60px] w-[50%] border-black border-[1px]">
                    Nifty
                </div>
                <div className="sensexSection h-[60px] w-[50%] border-black border-[1px]">
                    Sensex
                </div>
            </div>

            <div className="watchListsDiv h-[50px] flex flex-row items-end border-black border-[1px]">
                <div className="watchLists w-[90%] text-[17px] h-[80%] ml-[5px] overflow-x-auto overflow-y-hidden border-black border-[1px]">
                    {
                        watchLists.map((element, index) => (
                            <div className="watchList inline h-[85%] mx-[3px] px-[3px] max-w-[50%] rounded-[7px] truncate ... hover:cursor-pointer border-black border-[1px]"
                            key={index} index={index} onClick={watchListClicked}>
                                {element.name}
                            </div>
                        ))
                    }
                </div>

                <div className="addWatchListDiv h-[30px] w-[30px] text-[30px] font-[300] mx-[5px] flex justify-center items-center hover:cursor-pointer border-black border-[1px]">
                    +
                </div>
            </div>

            <div className="currentWatchList text-[18px] border-black border-[1px]">
                {
                    currentWatchList != null ?
                    (
                        <div className="currentWatchListInformation h-[40px] flex flex-row">
                            <div className="currentWatchListNameDiv max-w-[70%] pl-[5px] pr-[5px] flex items-center border-black border-[1px]">
                                <div className="currentWatchListName text-[18px]">{currentWatchList.name}</div>
                            </div>

                            <div className="currentWatchListStocksNumberDiv flex items-center">
                                <div className="currentWatchListStocksNumber text-[15px] font-[500] rounded-[5px] border-black border-[1px]">{currentWatchList.stocks.length}/20</div>
                            </div>

                            <div className="editWatchListOptions mr-[10px] flex flex-row items-center grow justify-end">
                                <div className="addScripButton h-[28px] w-[28px] text-[30px] font-[350] text-center flex justify-center items-center hover:cursor-pointer border-black border-[1px]"
                                onClick={addScripButtonClicked}>
                                    +
                                </div>
                            </div>
                        </div>
                    ) :
                    <></>
                }
                {
                    currentWatchList != null ?
                    (
                        currentWatchList.stocks.map((element, index) =>
                        (
                            <div className="stock h-[60px] flex flex-row border-black border-[1px] hover:cursor-pointer"
                            key={index} index={index} onMouseEnter={hoveringOnStock} onMouseLeave={notHoveringOnStock}>
                                <div className="stockInformation w-[80%] flex flex-col justify-center px-[5px]" index={index}>
                                    <div className="name text-[17px] font-[450]" index={index}>{element.name}</div>
                                    <div className="instrumentKey text-[12px] font-[360]" index={index}>{element.instrumentKey}</div>
                                </div>

                                {
                                    hoveringStockIndex != index ?
                                    (
                                        <div className="stockPrice" index={index}>
                                            <div className="price" index={index}>200.00</div>
                                            <div className="growth" index={index}>12%</div>
                                        </div>
                                    ) :
                                    (
                                        <div className="stockEditOptions flex flex-row grow h-full justify-center items-center z-2 border-black border-[1px]">
                                            <div className="buy border-black border-[1px] mx-[5px] px-[5px]" onClick={buyStock}>B</div>
                                            <div className="sell border-black border-[1px] mx-[5px] px-[5px]" onClick={sellStock}>S</div>
                                            <div className="delete border-black border-[1px] ml-[5px] mr-[10px] px-[5px]" onClick={deleteStockFromWatchList}>D</div>
                                        </div>
                                    )
                                }
                            </div>
                        ))
                    ) :
                    <></>
                }
            </div>
            {
                displayAddScripsDropdown ?
                <AddScriptDropdown /> :
                <></>
            }
        </div>
    );
}