"use client";
import { useChartsStore } from '../../../zustand/useChartsStore';
import { memo, useEffect } from 'react';
import './styles/Stock.css';

function Stock({stock, index, stockClicked, hoveringOnStock, notHoveringOnStock, hoveringStockIndex,
                deleteStockFromWatchList, placeOrder, liveMarketData}) {

    const {currentStock} = useChartsStore();

    useEffect(() => {

    }, []);

    return (
        <div className="stock h-[65px] flex flex-row hover:cursor-pointer border-black border-b-[1px]"
            id={currentStock != null && currentStock.instrumentKey == stock.instrumentKey ? "chosenStock" : "stock"} instrument-key={stock.instrumentKey} key={index} index={index}
            onMouseEnter={hoveringOnStock} onMouseLeave={notHoveringOnStock}
            onClick={stockClicked}>
            <div className="stockInformation min-w-[70%] flex flex-col justify-center pl-[10px] pr-[5px]"
                index={index} instrument-key={stock.instrumentKey}>
                <div className="name text-[17px] font-[450] truncate ..." index={index} instrument-key={stock.instrumentKey}>
                    {stock.name}
                </div>
                <div className="exchange text-[12px] font-[360] truncate ..." index={index} instrument-key={stock.instrumentKey}>
                    {stock.exchange}
                </div>
            </div>

            {
                hoveringStockIndex != index ?
                (
                    <div className="stockPrice w-full mr-[5%] mt-[2px]" index={index}>
                        <div className="price h-[50%] text-[16px] pt-[7px] font-[450] flex justify-end truncate ..."
                            id={liveMarketData?.close1D > liveMarketData?.open1D ?
                                "positivePrice" : "negativePrice"} index={index}>
                            {liveMarketData == null ? "" : <span className="rupeeSign mr-[2px]">&#8377;</span>}
                            {liveMarketData == null ? "" : (liveMarketData?.ltp * 100 / 100).toFixed(2)}
                        </div>
                        <div className="growth h-[50%] text-[13px] flex justify-end truncate ..."
                            id={liveMarketData?.close1D > liveMarketData?.open1D ?
                                "positiveGrowth" : "negativeGrowth"} index={index}>
                            {
                                liveMarketData?.close1D > liveMarketData?.open1D ? ("+") : ("")
                            }
                            {
                                liveMarketData && liveMarketData?.open1D != 0 ?
                                ((liveMarketData?.close1D - liveMarketData?.open1D) /
                                    liveMarketData?.open1D * 100).toFixed(2) + "%" :
                                ""
                            }
                        </div>
                    </div>
                ) :
                (
                    <div className="stockEditOptions flex flex-row grow h-full w-[30%] justify-center items-center"
                        instrument-key={stock.instrumentKey}>
                        <div className="buy mx-[5px] px-[5px] font-[450] rounded-[5px]"
                            id="buy" index={index} onClick={placeOrder}>
                            B
                        </div>
                        <div className="sell mx-[5px] px-[5px] font-[450] rounded-[5px]"
                            id="sell" index={index} onClick={placeOrder}>
                            S
                        </div>
                        <i className="delete fa-solid fa-trash fa-lg h-[30px] w-[30px] mr-[8px] mt-[5px] pt-[12px] pl-[3px] ml-[5px] h-[30px] mr-[10px] px-[5px]"
                            id="delete" instrument-key={stock.instrumentKey} onClick={deleteStockFromWatchList}>
                        </i>
                    </div>
                )
            }
        </div>
    );
}

export default memo(Stock);