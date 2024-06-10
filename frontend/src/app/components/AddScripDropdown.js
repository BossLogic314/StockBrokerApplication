"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAddScripDropdownStore } from '../../../zustand/useAddScripDropdownStore';
import { useCurrentWatchListStore } from '../../../zustand/useCurrentWatchListStore';
import { useRouter } from 'next/navigation';
import './styles/AddScripDropdown.css';

export default function AddScripDropdown() {

    const {setDisplayAddScripsDropdown} = useAddScripDropdownStore();
    const {currentWatchList} = useCurrentWatchListStore();
    const {addStockToCurrentWatchList} = useCurrentWatchListStore();
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

    const addScriptClicked = (event) => {

        if (currentWatchList.stocks.length == 20) {
            alert('Cannot add more stocks to the watchlist');
            return;
        }

        const exchange = event.target.getAttribute('exchange');
        const instrumentKey = event.target.getAttribute('instrument-key');
        const type = event.target.getAttribute('type');
        const name = event.target.getAttribute('name');

        const stockToAdd = {
            exchange: exchange,
            instrumentKey: instrumentKey,
            name: name,
            type: type
        }
        addStockToCurrentWatchList(stockToAdd);
    }

    useEffect(() => {

    }, []);

    return (
        <div className="h-full w-[30px] absolute top-0 left-[340px] w-[350px] z-2 bg-blue-100">
            <div className="searchBarDiv w-full h-[60px] flex flex-row border-black border-[1px]">
                <input className="searchBar w-[85%] text-[16px] font-[450] px-[8px] py-[10px] mx-[10px] my-[8px] rounded-[5px] border-black border-[1px]"
                placeholder="Which scrip are you looking for?"
                onChange={searchForScrips}></input>

                <div className="closeAddScripDropdownDiv flex flex-col justify-center">
                    <div className="closeAddScripDropdownButtonDiv h-[35px] w-[35px] mr-[5px] text-[20px] rounded-full flex flex-col items-center justify-center hover:cursor-pointer hover:border-black hover:bg-white hover:border-[1px]"
                    onClick={closeButtonClicked}>
                        X
                    </div>
                </div>
            </div>

            <div className="scrips">
                {
                    scripsToPrompt.map((element) =>
                    (
                        <div className="stock py-[5px] flex flex-row border-black border-[1px]" key={element._source.instrumentKey}>
                            <div className="stockInformation w-[80%] flex flex-col justify-center ml-[4px] px-[5px] border-black border-[1px]">
                                <div className="name text-[17px] font-[450]">{element._source.name}</div>
                                <div className="instrumentKey text-[12px] font-[360]">{element._source.instrumentKey}</div>
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