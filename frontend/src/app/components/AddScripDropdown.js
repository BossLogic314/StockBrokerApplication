"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAddScripDropdownStore } from '../../../zustand/useAddScripDropdownStore';
import { useWatchListStore } from '../../../zustand/useWatchListStore';
import { useUserDataStore } from '../../../zustand/useUserDataStore';
import { useRouter } from 'next/navigation';
import './styles/AddScripDropdown.css';

export default function AddScripDropdown({ getWatchLists }) {

    const {userData} = useUserDataStore();
    const {setDisplayAddScripsDropdown} = useAddScripDropdownStore();
    const {currentWatchList, currentWatchListIndex, addStockToCurrentWatchList} = useWatchListStore();
    const [scripsToPrompt, setScripsToPrompt] = useState([]);
    const router = useRouter();

    const searchForScrips = (async (event) => {
        const searchString = event.target.value;
        // If less than 3 characters are entered
        if (searchString.length < 3) {
            setScripsToPrompt([]);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8086/marketData/getScrips?searchString=${searchString}`,
            {
                withCredentials: true
            });
            const scrips = response.data.scrips.body.hits.hits;
            setScripsToPrompt(scrips);
        }
        // The user has to login again
        catch(error) {
            router.replace('/');
        }
    });

    const closeButtonClicked = (event) => {
        setDisplayAddScripsDropdown(false);
    }

    const addScriptClicked = async(event) => {

        if (currentWatchList.stocks.length == 20) {
            alert('Cannot add more stocks to the watchlist');
            return;
        }

        for (let i = 0; i < currentWatchList.stocks.length; ++i) {

            // If the stock is already present in the watchlist
            if (currentWatchList.stocks[i].instrumentKey == event.target.getAttribute('instrument-key')) {
                return;
            }
        }

        const exchange = event.target.getAttribute('exchange');
        const instrumentKey = event.target.getAttribute('instrument-key');
        const type = event.target.getAttribute('type');
        const name = event.target.getAttribute('name');

        // Adding the stock in the watchlist in the database
        try {
            const response = await axios.post('http://localhost:8087/watchLists/addStockToWatchList',
            {
                userId: userData.user_id,
                watchListIndex: currentWatchListIndex,
                instrumentKey: instrumentKey,
                name: name,
                instrumentType: type,
                exchange: exchange
            },
            {
                withCredentials: true
            });
        }
        // The user needs to login again
        catch(error) {
            router.replace('/');
        }

        const stockToAdd = {
            instrumentKey: instrumentKey,
            name: name,
            type: type,
            exchange: exchange
        }
        addStockToCurrentWatchList(stockToAdd);

        // Get all watchlists from the database once again
        await getWatchLists();
    }

    useEffect(() => {

    }, []);

    return (
        <div className="addScrip h-full w-[30px] absolute top-0 left-[340px] w-[350px] flex flex-col z-10" id="addScrip">
            <div className="searchBarDiv w-full h-[60px] flex flex-row border-black border-t-[1px] border-r-[1px] border-b-[1px]">
                <input className="searchBar w-[85%] text-[16px] font-[450] px-[8px] py-[10px] mx-[10px] my-[8px] rounded-[5px] border-black border-[1px]"
                placeholder="Which scrip are you looking for?"
                onChange={searchForScrips}></input>

                <div className="closeAddScripDropdownDiv flex flex-col justify-center">
                    <div className="closeAddScripDropdownButtonDiv h-[35px] w-[35px] mr-[5px] text-[20px] rounded-full flex flex-col items-center justify-center hover:cursor-pointer"
                        id="closeAddScripDropdownButtonDiv" onClick={closeButtonClicked}>
                        X
                    </div>
                </div>
            </div>

            <div className="scrips flex-grow overflow-y-auto border-black border-r-[1px]">
                {
                    scripsToPrompt.map((element) =>
                    (
                        <div className="stock py-[5px] flex flex-row border-black border-b-[1px]" key={element._source.instrumentKey}>
                            <div className="stockInformation w-[78%] flex flex-col justify-center ml-[7px] px-[5px]">
                                <div className="name text-[17px] font-[450] truncate ...">{element._source.name}</div>
                                <div className="instrumentKey text-[12px] font-[360] truncate ...">{element._source.instrumentKey}</div>
                            </div>

                            <div className="addButtonDiv flex flex-col flex-grow justify-center items-center">
                                <div className="addButton text-[18px] px-[4px] py-[2px] hover:cursor-pointer border-black border-[1px]"
                                id="addButton" onClick={addScriptClicked}
                                exchange={element._source.exchange}
                                instrument-key={element._source.instrumentKey}
                                name={element._source.name}
                                type={element._source.type}>
                                    Add
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}