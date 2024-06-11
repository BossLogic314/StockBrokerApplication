"use client";
import { useEffect, useState } from 'react';
import { useUserDataStore } from '../../../zustand/useUserDataStore';
import { useLoadingStore } from '../../../zustand/useLoadingStore';
import { useAddScripDropdownStore } from '../../../zustand/useAddScripDropdownStore';
import { useWatchListStore } from '../../../zustand/useWatchListStore';
import { useShowDeleteWatchListWarningStore } from '../../../zustand/useShowDeleteWatchListWarningStore';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import AddScriptDropdown from './AddScripDropdown';
import DeleteWatchListWarning from './DeleteWatchListWarning';
import './styles/WatchListsSection.css';

export default function WatchListsSection() {

    const {userData, setUserData} = useUserDataStore();
    const {loading, setLoading} = useLoadingStore();
    const {watchLists, setWatchLists, currentWatchList, setCurrentWatchList,
            currentWatchListIndex, setCurrentWatchListIndex, deleteStockFromCurrentWatchList} = useWatchListStore();
    const [hoveringStockIndex, setHoveringStockIndex] = useState(-1);
    const [hoveringOnWatchListName, setHoveringOnWatchListName] = useState(false);
    const [editingWatchListName, setEditingWatchListName] = useState(false);
    const [newWatchListName, setNewWatchListName] = useState('');
    const {showDeleteWatchListWarning, setShowDeleteWatchListWarning} = useShowDeleteWatchListWarningStore();
    const {displayAddScripsDropdown, setDisplayAddScripsDropdown} = useAddScripDropdownStore();
    const router = useRouter();

    const getWatchLists = (async () => {

        // If the user data has not loaded yet
        if (loading) {
            return null;
        }

        try {
            const response = await axios.get(`http://localhost:8087/watchLists/getWatchLists?userId=${userData.user_id}`,
            {
                withCredentials: true
            });
            setWatchLists(response.data.watchLists);
            return response.data.watchLists;
        }
        // The user needs to login again
        catch(error) {
            router.replace('/');
        }
    });

    const watchListClicked = (event) => {
        // If the user was editing some watchlists's name
        cancelChangeOfWatchListName();

        const index = event.target.getAttribute('index');
        setCurrentWatchListIndex(index);
        setCurrentWatchList(watchLists[index]);
    }

    const editWatchListNameButtonClicked = (event) => {
        setNewWatchListName(currentWatchList.name);
        setEditingWatchListName(true);
    }

    const deleteWatchListButtonClicked = (event) => {
        setShowDeleteWatchListWarning(true);
    }

    const addScripButtonClicked = (event) => {
        setDisplayAddScripsDropdown(true);
    }

    const addNewWatchList = async(event) => {
        try {
            const response = await axios.post('http://localhost:8087/watchLists/addWatchList',
            {
                userId: userData.user_id
            },
            {
                withCredentials: true
            });
        }
        // The user needs to login again
        catch(error) {
            router.replace('/');
        }

        // Updating watchlists and the current watchlist
        const newWatchLists = await getWatchLists();
        setCurrentWatchListIndex(newWatchLists.length - 1);
    }

    const hoveringOnWatchList = (event) => {
        setHoveringOnWatchListName(true);
    }

    const notHoveringOnWatchList = (event) => {
        setHoveringOnWatchListName(false);
    }

    const hoveringOnStock = (event) => {
        const index = event.target.getAttribute('index');
        setHoveringStockIndex(index);
    }

    const notHoveringOnStock = (event) => {
        setHoveringStockIndex(null);
    }

    const buyStock = (event) => {
        console.log('Buy stock clicked');
    }

    const sellStock = (event) => {
        console.log('Sell stock clicked');
    }

    const deleteStockFromWatchList = async (event) => {

        const instrumentKey = event.target.getAttribute('instrument-key');
        // Deleting the stock from the watchlist in the database
        try {
            const response = await axios.post('http://localhost:8087/watchLists/deleteStockFromWatchList',
            {
                userId: userData.user_id,
                watchListIndex: currentWatchListIndex,
                instrumentKey: instrumentKey
            },
            {
                withCredentials: true
            });
        }
        // The user needs to login again
        catch(error) {
            router.replace('/');
        }

        deleteStockFromCurrentWatchList(currentWatchList.stocks[hoveringStockIndex]);
        setHoveringStockIndex(null);

        // Get all watchlists from the database once again
        getWatchLists();
    }

    const getWatchListsAndSetCurrentWatchList = async () => {
        const watchLists = await getWatchLists();
        if (watchLists && watchLists.length != 0) {
            setCurrentWatchList(watchLists[0]);
        }
    }

    const changeWatchListName = async (event) => {

        try {
            // Changing the watchlist name in the database
            const response = await axios.post('http://localhost:8087/watchLists/changeWatchListName',
            {
                userId: userData.user_id,
                newWatchListName: newWatchListName,
                watchListIndex: currentWatchListIndex
            },
            {
                withCredentials: true
            });

            // Fetching watchlists after updating the name
            const newWatchLists = await getWatchLists();

            // Re-render the current watchlist
            setCurrentWatchList(newWatchLists[currentWatchListIndex]);

            // The user is not editing the watchlist's name anymore
            cancelChangeOfWatchListName();
        }
        // The user needs to login again
        catch(error) {
            router.replace('/');
        }
    }

    const newWatchListNameChanged = (event) => {
        setNewWatchListName(event.target.value);
    }

    const cancelChangeOfWatchListName = () => {
        setNewWatchListName('');
        setEditingWatchListName(false);
    }

    const stockClicked = (event) => {
        cancelChangeOfWatchListName();
    }

    useEffect(() => {

        getWatchListsAndSetCurrentWatchList();
    }, [loading]);

    return (
        <div className="stocksSection h-full w-[340px] min-w-[340px] border-black border-[1px]">
            <div className="stockExchangesStatsSection flex flex-row">
                <div className="niftySection h-[60px] w-[50%] border-black border-[1px]">
                    Nifty
                </div>
                <div className="sensexSection h-[60px] w-[50%] border-black border-[1px]">
                    Sensex
                </div>
            </div>

            <div className="watchListsDiv h-[50px] flex flex-row items-end border-green-600 border-[1px]">
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

                <div className="addWatchListDiv h-[30px] w-[30px] text-[30px] font-[300] mx-[5px] flex justify-center items-center hover:cursor-pointer border-black border-[1px]"
                onClick={addNewWatchList}>
                    +
                </div>
            </div>

            <div className="currentWatchList text-[18px] border-black border-[1px]">
                {
                    currentWatchList != null ?
                    (
                        <div className="currentWatchListInformation h-[40px] flex flex-row"
                        onMouseEnter={hoveringOnWatchList} onMouseLeave={notHoveringOnWatchList}>
                            <div className="currentWatchListNameDiv max-w-[65%] pl-[5px] pr-[5px] flex items-center border-black border-[1px]">
                                <div className="currentWatchListName text-[18px] truncate ...">{currentWatchList.name}</div>
                            </div>

                            {
                                hoveringOnWatchListName ?
                                (
                                    <div className="editWatchListOptionsDiv min-w-[35%] flex flex-row items-center grow justify-end border-blue-400 border-[1px]">
                                        <div className="editWatchListOptions mr-[5px] flex flex-row border-red-400 border-[1px]">
                                            <div className="editWatchListNameButton h-[28px] w-[28px] mr-[8px] text-[30px] font-[350] text-center flex justify-center items-center hover:cursor-pointer border-black border-[1px]"
                                            onClick={editWatchListNameButtonClicked}>
                                                E
                                            </div>

                                            <div className="deleteWatchListButton h-[28px] w-[28px] mr-[8px] text-[30px] font-[350] text-center flex justify-center items-center hover:cursor-pointer border-black border-[1px]"
                                            onClick={deleteWatchListButtonClicked}>
                                                D
                                            </div>

                                            <div className="addScripButton h-[28px] w-[28px] text-[30px] font-[350] text-center flex justify-center items-center hover:cursor-pointer border-black border-[1px]"
                                            onClick={addScripButtonClicked}>
                                                +
                                            </div>
                                        </div>
                                    </div>
                                ) :
                                (
                                    <div className="currentWatchListStocksNumberDiv flex items-center">
                                        <div className="currentWatchListStocksNumber text-[15px] font-[500] rounded-[5px] border-black border-[1px]">{currentWatchList.stocks.length}/20</div>
                                    </div>
                                )
                            }
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
                            key={index} index={index} onMouseEnter={hoveringOnStock} onMouseLeave={notHoveringOnStock}
                            onClick={stockClicked}>
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
                                            <div className="delete border-black border-[1px] ml-[5px] mr-[10px] px-[5px]"
                                            instrument-key={element.instrumentKey} onClick={deleteStockFromWatchList}>
                                                D
                                            </div>
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
                <AddScriptDropdown getWatchLists={getWatchLists} /> :
                <></>
            }
            {
                showDeleteWatchListWarning ?
                <DeleteWatchListWarning getWatchLists={getWatchLists} /> :
                <></>
            }
            {
                editingWatchListName ?
                (
                    <div className="editWatchListNameDiv flex flex-row items-center fixed bg-blue-300 top-[110px] h-[40px] w-[340px] z-2 border-red-600 border-[1px]">
                        <input className="editWatchListName text-[15px] ml-[3%] px-[5px] border-black border-[1px] h-[80%] w-[70%]"
                        id="editWatchListName" defaultValue={newWatchListName} onChange={newWatchListNameChanged} autoFocus>
                        </input>
                        <div className="tick h-[80%] w-[10%] ml-[2%] pt-[2px] text-center hover:cursor-pointer border-black border-[1px]"
                        onClick={changeWatchListName}>
                            Y
                        </div>
                        <div className="cross h-[80%] w-[10%] ml-[2%] pt-[2px] text-center hover:cursor-pointer border-black border-[1px]"
                        onClick={cancelChangeOfWatchListName}>
                            N
                        </div>
                    </div>
                ) :
                <></>
            }
        </div>
    );
}