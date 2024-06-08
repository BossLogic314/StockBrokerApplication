"use client";
import { useEffect } from 'react';

export default function WatchListsSection() {

    useEffect(() => {

    }, []);

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

            <div className="watchLists">
                
            </div>
        </div>
    );
}