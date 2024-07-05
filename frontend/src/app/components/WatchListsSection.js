"use client";
import { useEffect, useState } from 'react';
import { useUserDataStore } from '../../../zustand/useUserDataStore';
import { useLoadingStore } from '../../../zustand/useLoadingStore';
import { useAddScripDropdownStore } from '../../../zustand/useAddScripDropdownStore';
import { usePlaceOrderDropdownStore } from '../../../zustand/usePlaceOrderDropdownStore';
import { useWatchListStore } from '../../../zustand/useWatchListStore';
import { useShowDeleteWatchListWarningStore } from '../../../zustand/useShowDeleteWatchListWarningStore';
import { useChartsStore } from '../../../zustand/useChartsStore';
import { useLiveMarketDataStore } from '../../../zustand/useLiveMarketDataStore';
import { useHoldingsStore } from '../../../zustand/useHoldingsStore';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import AddScriptDropdown from './AddScripDropdown';
import PlaceOrderDropdown from './PlaceOrderDropdown';
import DeleteWatchListWarning from './DeleteWatchListWarning';
import HeaderStock from './HeaderStock';
import Stock from './Stock';
import io from "socket.io-client";
import { signOut } from '../../../utils/UserProfile';
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
    const {toBuy, setToBuy, orderingStock, setOrderingStock, setLiveMarketDataOfOrderingStock,
            displayPlaceOrderDropdown, setDisplayPlaceOrderDropdown} = usePlaceOrderDropdownStore();
    const [socket, setSocket] = useState(null);
    const {liveMarketData, setLiveMarketData} = useLiveMarketDataStore();
    const {holdings, setHoldings} = useHoldingsStore();
    const {currentStock, setCurrentStock, setCurrentScale} = useChartsStore();
    const headerStocks =
        [
            {exchange: 'NSE_INDEX', instrumentKey: 'NSE_INDEX|Nifty 50', name: 'NIFTY 50'},
            {exchange: 'BSE_INDEX', instrumentKey: 'BSE_INDEX|SENSEX', name: 'SENSEX'}
        ];
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
            signOut();
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

        if (watchLists.length >= 20) {
            alert('Cannot add more watchlists');
            return;
        }

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
            signOut();
        }

        // Updating watchlists
        const newWatchLists = await getWatchLists();
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

    const placeOrder = (event) => {
        const index = event.target.getAttribute('index');

        // Live market data of the stock is not loaded yet
        if (liveMarketData[currentWatchList.stocks[index].instrumentKey] == null) {
            return;
        }

        if (event.target.textContent == 'B') {
            setToBuy(true);
        }
        else {
            setToBuy(false);
        }
        setOrderingStock(currentWatchList.stocks[index]);
        setDisplayPlaceOrderDropdown(true);

        const liveMarketDataOfOrderingStock = liveMarketData[currentWatchList.stocks[index].instrumentKey];
        setLiveMarketDataOfOrderingStock(liveMarketDataOfOrderingStock);
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
            signOut();
        }

        deleteStockFromCurrentWatchList(currentWatchList.stocks[hoveringStockIndex]);
        setHoveringStockIndex(null);

        // Get all watchlists from the database once again
        await getWatchLists();
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
            signOut();
        }
    }

    const newWatchListNameChanged = (event) => {
        setNewWatchListName(event.target.value);
    }

    const cancelChangeOfWatchListName = () => {
        setNewWatchListName('');
        setEditingWatchListName(false);
    }

    const stockClicked = async (event = null, instrumentKey = null) => {

        cancelChangeOfWatchListName();

        // If buy or sell button is clicked
        if (event != null && (event.target.id == 'buy' || event.target.id == 'sell' | event.target.id == 'delete')) {
            return;
        }

        if (instrumentKey == null) {
            instrumentKey = event.target.getAttribute('instrument-key');
        }
        let candles = null;
        try {
            const response = await axios.get(
                `http://localhost:8086/marketData/getDataInInterval?instrumentKey=${instrumentKey}&interval=1minute`,
            {
                withCredentials: true
            });
            candles = response.data.candles;
        }
        // When unable to fetch candle data, not displaying anything
        catch(error) {
            console.log(error);
        }

        const name = instrumentKey.split('|')[1];
        const obj = {
            instrumentKey: instrumentKey,
            name: name,
            candles: candles
        }
        setCurrentStock(obj);
        setCurrentScale('1 min');
    }

    const getWatchListsAndSetCurrentWatchList = async () => {
        const watchLists = await getWatchLists();
        if (watchLists && watchLists.length != 0) {
            setCurrentWatchList(watchLists[0]);
        }
    }

    const getLiveMarketData = async () => {

        // The current watchlist is not loaded yet
        if (currentWatchList == null) {
            return;
        }
        const newSocket = io('http://localhost:8086', {
            query: {
                key: userData.email
            }
        });
        setSocket(newSocket);

        newSocket.on('market data', (updatedLiveMarketData) => {

            updatedLiveMarketData = JSON.parse(updatedLiveMarketData);
            setLiveMarketData(updatedLiveMarketData);
        });

        let accessToken = null;
        // Getting the access token
        try {
            const response = await axios.get('http://localhost:8088/user/getAccessToken',
            {
                withCredentials: true
            });
            accessToken = response.data.accessToken;
        }
        // The user has to login again
        catch(error) {
            signOut();
        }

        let instrumentKeys = currentWatchList.stocks.map(element => element.instrumentKey);
        for (let i = 0; i < headerStocks.length; ++i) {
            instrumentKeys.push(headerStocks[i].instrumentKey);
        }
        for (let i = 0; i < holdings.length; ++i) {
            instrumentKeys.push(holdings[i].instrument_token);
        }

        newSocket.emit('market data',
        {
            accessToken: accessToken,
            key: userData.email,
            instrumentKeys: instrumentKeys
        });
    }

    useEffect(() => {

        getWatchListsAndSetCurrentWatchList();
    }, [loading]);

    // When the current watchlist or holdings change
    useEffect(() => {

        // Wait until the user's data is loaded
        if (userData == null) {
            return;
        }
        // Establish a web socket connection to get live market data
        getLiveMarketData();
    }, [currentWatchList, holdings, userData]);

    useEffect(() => {

        stockClicked(null, headerStocks[0].instrumentKey);

        const script = document.createElement("script");
        script.src = "https://kit.fontawesome.com/13ecd81147.js";
        script.async = true;
    
        document.body.appendChild(script);
    }, []);

    return (
        <div className="stocksSection h-full w-[340px] min-w-[340px] flex flex-col border-black border-[1px]">
            <div className="stockExchangesStatsSection flex flex-row border-black border-b-[1px]" id="stockExchangesStatsSection">
                {
                    headerStocks.map((element) => (
                        <HeaderStock stock={element} liveMarketData={liveMarketData[element.instrumentKey]} key={element.instrumentKey} />
                    ))
                }
            </div>

            <div className="watchListsDiv h-[50px] flex flex-row items-end" id="watchListsDiv">
                <div className="watchLists w-[90%] flex-flex-row text-[17px] h-[70%] ml-[5px] overflow-x-hidden overflow-y-hidden"
                    id="watchLists">
                    {
                        watchLists.map((element, index) => (
                            <div className="watchListDiv inline" key={index}>
                                <div className="watchList inline h-[85%] mx-[3px] px-[5px] py-[1px] text-[17.5px] font-[400] max-w-[50%] rounded-[7px] truncate ... hover:cursor-pointer"
                                    id={currentWatchListIndex != null && currentWatchListIndex == index ? "chosenWatchList" : "watchList"}
                                    key={index} index={index} onClick={watchListClicked}>
                                    {element.name}
                                </div>
                            </div>
                        ))
                    }
                </div>

                <div className="addWatchListDiv h-full w-[30px] text-[30px] font-[300] mx-[5px] flex justify-center items-center hover:cursor-pointer">
                    <i className="addWatchListButton fa-solid fa-plus fa-sm h-[30px] w-[30px] mt-[5px] pt-[12px] pl-[2px] hover:cursor-pointer"
                        id="addWatchListButton" onClick={addNewWatchList}>
                    </i>
                </div>
            </div>

            <div className="currentWatchList text-[18px] flex flex-grow overflow-y-hidden flex-col border-black border-t-[1px]">
                {
                    currentWatchList != null ?
                    (
                        <div className="currentWatchListInformation min-h-[45px] max-h-[45px] flex flex-row border-black border-b-[1px]"
                            id="currentWatchListInformation" onMouseEnter={hoveringOnWatchList} onMouseLeave={notHoveringOnWatchList}>
                            <div className="currentWatchListNameDiv max-w-[65%] pl-[10px] pr-[5px] flex items-center">
                                <div className="currentWatchListName text-[20px] font-[500] truncate ...">{currentWatchList.name}</div>
                            </div>

                            {
                                hoveringOnWatchListName ?
                                (
                                    <div className="editWatchListOptionsDiv min-w-[35%] flex flex-row items-center grow justify-end">
                                        <div className="editWatchListOptions mr-[5px] flex flex-row">
                                            <i className="editWatchListNameButton fa-solid fa-pencil fa-lg h-[30px] w-[30px] mr-[8px] mt-[3px] pt-[12px] pl-[3px] hover:cursor-pointer"
                                                id="editWatchListNameButton" onClick={editWatchListNameButtonClicked}>
                                            </i>

                                            <i className="deleteWatchListButton fa-solid fa-trash fa-lg h-[30px] w-[30px] mr-[8px] mt-[3px] pt-[12px] pl-[3px] hover:cursor-pointer"
                                                id="deleteWatchListButton" onClick={deleteWatchListButtonClicked}>
                                            </i>

                                            <i className="addScripButton fa-solid fa-plus fa-lg h-[30px] w-[30px] mt-[3px] pt-[12px] pl-[3px] hover:cursor-pointer"
                                                id="addScripButton" onClick={addScripButtonClicked}>
                                            </i>
                                        </div>
                                    </div>
                                ) :
                                (
                                    <div className="currentWatchListStocksNumberDiv flex items-center">
                                        <div className="currentWatchListStocksNumber text-[15px] px-[5px] py-[1px] font-[400] rounded-[5px] border-black border-[1px]"
                                            id="currentWatchListStocksNumber">
                                            {currentWatchList.stocks.length}/20
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    ) :
                    <></>
                }
                <div className="stocks flex-grow overflow-y-auto" id="stocks">
                {
                    currentWatchList != null ?
                    (
                        currentWatchList.stocks.map((element, index) =>
                        (
                            <Stock
                                stock={element} index={index} stockClicked={stockClicked}
                                hoveringOnStock={hoveringOnStock} notHoveringOnStock={notHoveringOnStock}
                                hoveringStockIndex={hoveringStockIndex}
                                deleteStockFromWatchList={deleteStockFromWatchList}
                                placeOrder={placeOrder}
                                liveMarketData={liveMarketData[element.instrumentKey]}
                                key={element.instrumentKey}
                            />
                        ))
                    ) :
                    <></>
                }
                </div>
            </div>
            {
                displayAddScripsDropdown ?
                <AddScriptDropdown getWatchLists={getWatchLists} /> :
                <></>
            }
            {
                displayPlaceOrderDropdown ?
                <PlaceOrderDropdown stock={orderingStock} toBuy={toBuy} /> :
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
                    <div className="editWatchListNameDiv flex flex-row items-center fixed top-[110px] h-[50px] w-[340px] z-2" id="editWatchListNameDiv">
                        <input className="editWatchListName text-[18px] ml-[3%] px-[5px] border-black border-[1px] h-[80%] w-[70%] rounded-[5px]"
                        id="editWatchListName" defaultValue={newWatchListName} onChange={newWatchListNameChanged} autoFocus>
                        </input>
                        <div className="tickDiv h-full w-[10%] ml-[2%] pt-[2px] flex justify-center items-center hover:cursor-pointer">
                            <i className="tick fa-solid fa-check fa-lg h-[30px] w-[30px] mt-[3px] pt-[12px] pl-[5px] hover:cursor-pointer"
                                id="tick" onClick={changeWatchListName}>
                            </i>
                        </div>
                        <div className="crossDiv h-full w-[10%] ml-[2%] pt-[2px] flex justify-center items-center hover:cursor-pointer">
                            <i className="cross fa-solid fa-xmark fa-lg h-[30px] w-[30px] mt-[3px] pt-[12px] pl-[5px] hover:cursor-pointer"
                                id="cross" onClick={cancelChangeOfWatchListName}>
                            </i>
                        </div>
                    </div>
                ) :
                <></>
            }
        </div>
    );
}