"use client";
import { memo, useEffect } from 'react';
import './styles/HeaderStock.css';

function HeaderStock({stock, liveMarketData}) {

    useEffect(() => {

    }, []);

    return (
        <div className="stock h-[60px] w-[50%] flex flex-row">
            <div className="stockInformation h-full w-[50%] pl-[10px] flex flex-col justify-center border-black border-l-[1px]"
                id="stockInformation">
                <div className="name text-[14px] font-[500] truncate ...">{stock.name}</div>
                <div className="exchange text-[11px] font-[360] truncate ...">{stock.exchange}</div>
            </div>
            <div className="stockPrice w-full mr-[5%] mt-[2px]">
                <div className="price h-[50%] text-[14px] pt-[8px] font-[480] flex justify-end truncate ..."
                    id={liveMarketData?.close1D > liveMarketData?.open1D ?
                    "positivePrice" : "negativePrice"}>
                        {liveMarketData == null ? "" : <span className="rupeeSign mr-[2px]">&#8377;</span>}
                        {liveMarketData == null ? "" : ((liveMarketData?.ltp * 100) / 100).toFixed(2)}
                </div>
                <div className="growth h-[50%] text-[12px] flex justify-end truncate ..."
                    id={liveMarketData?.close1D > liveMarketData?.open1D ? "positiveGrowth" : "negativeGrowth"}>
                    {
                        liveMarketData?.close1D > liveMarketData?.open1D ? ("+") : ("")
                    }
                    {
                        liveMarketData ?
                        ((liveMarketData?.close1D - liveMarketData?.open1D) / liveMarketData?.open1D * 100).toFixed(2) + "%" :
                        ""
                    }
                </div>
            </div>
        </div>
    );
}

export default memo(HeaderStock);