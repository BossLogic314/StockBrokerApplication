"use client";
import { useEffect, useState } from 'react';
import { useUserDataStore } from '../../../zustand/useUserDataStore';
import { useLoadingStore } from '../../../zustand/useLoadingStore';
import { useAddScripDropdownStore } from '../../../zustand/useAddScripDropdownStore';
import { useWatchListStore } from '../../../zustand/useWatchListStore';
import { useShowDeleteWatchListWarningStore } from '../../../zustand/useShowDeleteWatchListWarningStore';
import { useChartsStore } from '../../../zustand/useChartsStore';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import AddScriptDropdown from './AddScripDropdown';
import DeleteWatchListWarning from './DeleteWatchListWarning';
import io from "socket.io-client";
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
    const [socket, setSocket] = useState(null);
    const [liveMarketData, setLiveMarketData] = useState([]);
    const {currentStock, setCurrentStock, setCurrentScale} = useChartsStore();
    const [headerStocks, setHeaderStocks] = useState(
        [
            {exchange: 'NSE_INDEX', instrumentKey: 'NSE_INDEX|Nifty 50', name: 'NIFTY 50'},
            {exchange: 'BSE_INDEX', instrumentKey: 'BSE_INDEX|SENSEX', name: 'SENSEX'}
        ]
    );
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

    const stockClicked = async (event) => {

        cancelChangeOfWatchListName();

        // If buy or sell button is clicked
        if (event.target.id == 'buy' || event.target.id == 'sell' | event.target.id == 'delete') {
            return;
        }

        const instrumentKey = event.target.getAttribute('instrument-key');
        let candles = null;
        try {
            const response = await axios.get(
                `http://localhost:8086/marketData/getDataInInterval?instrumentKey=${instrumentKey}&interval=1minute`,
            {
                withCredentials: true
            });
            candles = response.data.candles;
        }
        // The user has to login again
        catch(error) {
            router.replace('/');
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
        const newSocket = io('http://localhost:8086/');

        newSocket.on('market data', (liveMarketData) => {
            setLiveMarketData(JSON.parse(liveMarketData));
        });

        setSocket(newSocket);

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
            router.replace('/');
        }

        const instrumentKeys = currentWatchList.stocks.map(element => element.instrumentKey);
        for (let i = 0; i < headerStocks.length; ++i) {
            instrumentKeys.push(headerStocks[i].instrumentKey);
        }

        newSocket.emit('market data',
        {
            accessToken: accessToken,
            instrumentKeys: instrumentKeys
        });
    }

    useEffect(() => {

        getWatchListsAndSetCurrentWatchList();
    }, [loading]);

    // When the current watchlist changes
    useEffect(() => {
        // Establish a web socket connection to get live market data
        getLiveMarketData();
    }, [currentWatchList]);

    return (
        <div className="stocksSection h-full w-[340px] min-w-[340px] border-black border-[1px]">
            <div className="stockExchangesStatsSection flex flex-row border-black border-b-[1px]">
                {
                    headerStocks.map((element) => (
                        <div className="stock h-[60px] w-[50%] flex flex-row">
                            <div className="stockInformation h-full w-[50%] pl-[10px] flex flex-col justify-center border-black border-l-[1px]"
                                id="stockInformation">
                                <div className="name text-[14px] font-[500] truncate ...">{element.name}</div>
                                <div className="exchange text-[11px] font-[360] truncate ...">{element.exchange}</div>
                            </div>
                            {
                                liveMarketData.find((el) => el.instrumentKey == element.instrumentKey) ?
                                <div className="stockPrice w-full mr-[5%] mt-[2px]">
                                    {
                                        liveMarketData.find((el) => el.instrumentKey == element.instrumentKey)?.close1D >
                                        liveMarketData.find((el) => el.instrumentKey == element.instrumentKey)?.open1D ?
                                        (
                                            <>
                                                <div className="price h-[50%] text-[14px] pt-[8px] font-[480] flex justify-end truncate ..."
                                                    id="positivePrice">
                                                    {
                                                        liveMarketData.find((el) => el.instrumentKey == element.instrumentKey)?.ltp
                                                    }
                                                </div>
                                                <div className="growth h-[50%] text-[12px] flex justify-end truncate ..."
                                                    id="positiveGrowth">
                                                    +
                                                    {
                                                        ((liveMarketData.find((el) => el.instrumentKey == element.instrumentKey)?.close1D -
                                                        liveMarketData.find((el) => el.instrumentKey == element.instrumentKey)?.open1D) /
                                                        liveMarketData.find((el) => el.instrumentKey == element.instrumentKey)?.open1D * 100).toFixed(2)
                                                    }
                                                    %
                                                </div>
                                            </>
                                        ) :
                                        (
                                            <>
                                                <div className="price h-[50%] text-[14px] pt-[8px] font-[450] flex justify-end truncate ..."
                                                    id="negativePrice">
                                                    {
                                                        liveMarketData.find((el) => el.instrumentKey == element.instrumentKey)?.ltp
                                                    }
                                                </div>
                                                <div className="growth h-[50%] text-[12px] flex justify-end truncate ..."
                                                    id="negativeGrowth">
                                                    +
                                                    {
                                                        ((liveMarketData.find((el) => el.instrumentKey == element.instrumentKey)?.close1D -
                                                        liveMarketData.find((el) => el.instrumentKey == element.instrumentKey)?.open1D) /
                                                        liveMarketData.find((el) => el.instrumentKey == element.instrumentKey)?.open1D * 100).toFixed(2)
                                                    }
                                                    %
                                                </div>
                                            </>
                                        )
                                    }
                                </div> :
                                <></>
                            }
                        </div>
                    ))
                }
            </div>

            <div className="watchListsDiv h-[50px] flex flex-row items-end">
                <div className="watchLists w-[90%] flex-flex-row text-[17px] h-[70%] ml-[5px] overflow-x-hidden overflow-y-hidden"
                    id="watchLists">
                    {
                        watchLists.map((element, index) => (
                            <div className="watchList inline h-[85%] mx-[3px] px-[5px] py-[1px] max-w-[50%] rounded-[7px] truncate ... hover:cursor-pointer border-black border-[1px]"
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

            <div className="currentWatchList text-[18px] border-black border-t-[1px]">
                {
                    currentWatchList != null ?
                    (
                        <div className="currentWatchListInformation h-[40px] flex flex-row border-black border-b-[1px]" id="currentWatchListInformation"
                        onMouseEnter={hoveringOnWatchList} onMouseLeave={notHoveringOnWatchList}>
                            <div className="currentWatchListNameDiv max-w-[65%] pl-[10px] pr-[5px] flex items-center">
                                <div className="currentWatchListName text-[18px] font-[500] truncate ...">{currentWatchList.name}</div>
                            </div>

                            {
                                hoveringOnWatchListName ?
                                (
                                    <div className="editWatchListOptionsDiv min-w-[35%] flex flex-row items-center grow justify-end">
                                        <div className="editWatchListOptions mr-[5px] flex flex-row">
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
                                        <div className="currentWatchListStocksNumber text-[15px] px-[5px] py-[1px] font-[400] rounded-[5px] border-black border-[1px]">
                                            {currentWatchList.stocks.length}/20
                                        </div>
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
                            <div className="stock h-[65px] flex flex-row hover:cursor-pointer border-black border-b-[1px]" id="stock"
                                instrument-key={element.instrumentKey} key={index} index={index}
                                onMouseEnter={hoveringOnStock} onMouseLeave={notHoveringOnStock}
                                onClick={stockClicked}>
                                <div className="stockInformation min-w-[70%] flex flex-col justify-center pl-[10px] pr-[5px]"
                                    index={index} instrument-key={element.instrumentKey}>
                                    <div className="name text-[17px] font-[450] truncate ..." index={index} instrument-key={element.instrumentKey}>
                                        {element.name}
                                    </div>
                                    <div className="exchange text-[12px] font-[360] truncate ..." index={index} instrument-key={element.instrumentKey}>
                                        {element.exchange}
                                    </div>
                                </div>

                                {
                                    hoveringStockIndex != index ?
                                    (
                                        liveMarketData.find((el) => el.instrumentKey == element.instrumentKey) ?
                                        (<div className="stockPrice w-full mr-[5%] mt-[2px]" index={index}>
                                            {
                                                liveMarketData.find((el) => el.instrumentKey == element.instrumentKey)?.close1D >
                                                liveMarketData.find((el) => el.instrumentKey == element.instrumentKey)?.open1D ?
                                                (
                                                    <>
                                                        <div className="price h-[50%] text-[16px] pt-[7px] font-[450] flex justify-end truncate ..."
                                                            id="positivePrice" index={index}>
                                                            {
                                                                liveMarketData.find((el) => el.instrumentKey == element.instrumentKey)?.ltp
                                                            }
                                                        </div>
                                                        <div className="growth h-[50%] text-[13px] flex justify-end truncate ..."
                                                            id="positiveGrowth" index={index}>
                                                            +
                                                            {
                                                                ((liveMarketData.find((el) => el.instrumentKey == element.instrumentKey)?.close1D -
                                                                liveMarketData.find((el) => el.instrumentKey == element.instrumentKey)?.open1D) /
                                                                liveMarketData.find((el) => el.instrumentKey == element.instrumentKey)?.open1D * 100).toFixed(2)
                                                            }
                                                            %
                                                        </div>
                                                    </>
                                                ) :
                                                (
                                                    <>
                                                        <div className="price h-[50%] text-[16px] pt-[7px] font-[450] flex justify-end truncate ..."
                                                            id="negativePrice" index={index}>
                                                            {
                                                                liveMarketData.find((el) => el.instrumentKey == element.instrumentKey)?.ltp
                                                            }
                                                        </div>
                                                        <div className="growth h-[50%] text-[13px] flex justify-end truncate ..."
                                                            id="negativeGrowth" index={index}>
                                                            {
                                                                ((liveMarketData.find((el) => el.instrumentKey == element.instrumentKey)?.close1D -
                                                                liveMarketData.find((el) => el.instrumentKey == element.instrumentKey)?.open1D) /
                                                                liveMarketData.find((el) => el.instrumentKey == element.instrumentKey)?.open1D * 100).toFixed(2)
                                                            }
                                                            %
                                                        </div>
                                                    </>
                                                )
                                            }
                                        </div>) :
                                        <></>
                                    ) :
                                    (
                                        <div className="stockEditOptions flex flex-row grow h-full w-[30%] justify-center items-center"
                                            instrument-key={element.instrumentKey}>
                                            <div className="buy mx-[5px] px-[5px] font-[450] rounded-[5px]" id="buy" onClick={buyStock}>B</div>
                                            <div className="sell mx-[5px] px-[5px] font-[450] rounded-[5px]" id="sell" onClick={sellStock}>S</div>
                                            <div className="delete border-black border-[1px] ml-[5px] mr-[10px] px-[5px] rounded-[5px]" id="delete"
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