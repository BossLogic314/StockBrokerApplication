import { useEffect, useState } from "react";
import { useHoldingsStore } from '../../../zustand/useHoldingsStore';
import { useLiveMarketDataStore } from '../../../zustand/useLiveMarketDataStore';
import { signOut } from "../../../utils/UserProfile";
import axios from "axios";
import './styles/HoldingsTab.css';

export default function HoldingsTab() {

    const {holdings, setHoldings} = useHoldingsStore();
    const [investedAmount, setInvestedAmount] = useState(null);
    const [currentAmount, setCurrentAmount] = useState(null);
    const [overallProfitLossValue, setOverallProfitLossValue] = useState(null);
    const [overallProfitLossPercentage, setOverallProfitLossPercentage] = useState(null);
    const holdingsHeaderFields = ['Symbol', 'Net Qty', 'Avg. Price', 'LTP', 'Current Value', 'Overall P&L', 'Overall %'];
    const {liveMarketData, setLiveMarketData} = useLiveMarketDataStore();

    const getHoldings = async () => {
        try {
            const response = await axios.get('http://localhost:8088/user/getHoldings',
            {
                withCredentials: true
            });
            setHoldings(response.data.holdings.data);
        }
        // The user has to login again
        catch(error) {
            signOut();
        }
    }

    useEffect(() => {
        let newInvestedAmount = 0;
        let newCurrentAmount = 0;
        for (let i = 0; i < holdings.length; ++i) {
            newInvestedAmount += (holdings[i].average_price * holdings[i].quantity);

            if (liveMarketData[holdings[i].instrument_token]) {
                newCurrentAmount += (liveMarketData[holdings[i].instrument_token].ltp * holdings[i].quantity);
            }
        }
        setInvestedAmount(((newInvestedAmount * 100) / 100).toFixed(2));

        if (newCurrentAmount != 0) {
            setCurrentAmount(((newCurrentAmount * 100) / 100).toFixed(2));

            const diff = newCurrentAmount - newInvestedAmount;
            setOverallProfitLossValue(diff.toFixed(2));
            setOverallProfitLossPercentage((((diff / newInvestedAmount * 100) * 100) / 100).toFixed(2));
        }
    });

    useEffect(() => {
        getHoldings();
    }, []);

    return (
        <div className="flex flex-col flex-grow">
            <div className="investmentDetailsDiv flex flex-row mt-[10px] mx-[20px]" id="investmentDetailsDiv">
                <div className="investedAmountDiv flex flex-col justify-center items-center flex-grow px-[10px] py-[12px]">
                    <div className="investedAmountHeading text-[18px] font-[500]">Invested amount</div>
                    <div className="investedAmount mt-[2px] text-[19px] font-[360]">
                        {investedAmount == null ? "" : <span className="rupeeSign mr-[2px]">&#8377;</span>}
                        {investedAmount == null ? "" : investedAmount}
                    </div>
                </div>

                <div className="currentAmountDiv flex flex-col justify-center items-center flex-grow px-[10px] py-[12px]">
                    <div className="currentAmountHeading text-[18px] font-[500]">Current amount</div>
                    <div className="currentAmount mt-[2px] text-[19px] font-[360]">
                        {currentAmount == null ? "" : <span className="rupeeSign mr-[2px]">&#8377;</span>}
                        {currentAmount == null ? "" : currentAmount}
                    </div>
                </div>

                <div className="overallProfitLossDiv flex flex-col justify-center items-center flex-grow px-[10px] py-[12px]">
                    <div className="overallProfitLossHeading text-[18px] font-[500]">Overall P&L</div>
                    <div className="overallProfitLossAmount mt-[2px] text-[18px] font-[450]"
                    id={overallProfitLossValue != null && overallProfitLossPercentage != null && overallProfitLossValue > 0 ?
                        "positiveOverallProfitLossAmount" : "negativeOverallProfitLossAmount"}>
                        {
                            overallProfitLossValue == null || overallProfitLossPercentage == null ? "" :
                            <span className="rupeeSign mr-[2px]">&#8377;</span>
                        }
                        {
                            overallProfitLossValue != null && overallProfitLossPercentage != null && overallProfitLossValue > 0 ?
                            "+" : ""
                        }
                        {
                            overallProfitLossValue == null || overallProfitLossPercentage == null ? "" :
                            `${overallProfitLossValue} (${overallProfitLossPercentage}%)`
                        }
                    </div>
                </div>
            </div>
            <div className="holdingsInformation flex flex-col flex-grow my-[15px] mx-[20px] overflow-y-hidden overflow-x-hidden" id="holdingsInformation">

                <div className="holdingsHeader h-[50px] flex flex-row" id="holdingsHeader">
                    {
                        holdingsHeaderFields.map((element, index) => (
                            <div className="holdingsHeaderField w-[20%] min-w-[120px] text-[16px] font-[500] flex justify-center items-center" key={index}>
                                {element == 'Symbol' ? `Symbol (${holdings.length})` : element}
                            </div>
                        ))
                    }
                </div>

                <div className="holdings flex-grow overflow-y-auto overflow-x-hidden" id="holdings">
                    {
                        holdings.map((element, index) => (
                            <div className="holding h-[65px] flex flex-row" key={index} id="holding">
                                <div className="symbolEntry flex flex-col justify-center items-center h-full w-[20%] min-w-[120px]">
                                    <div className="symbolNameEntry text-[15px] font-[500] truncate ...">{element.tradingsymbol}</div>
                                    <div className="symbolExchangeEntry text-[11px] font-[360] truncate ...">{`${element.exchange}_INDEX`}</div>
                                </div>
                                <div className="netQuantityEntry flex flex-col justify-center items-center h-full w-[20%] min-w-[120px] truncate ...">
                                    {element.quantity}
                                </div>
                                <div className="averagePriceEntry flex flex-row justify-center items-center h-full w-[20%] min-w-[120px] truncate ...">
                                    <span className="rupeeSign mr-[2px]">&#8377;</span>
                                    {element.average_price.toFixed(2)}
                                </div>
                                <div className="ltpEntry flex flex-row justify-center items-center h-full w-[20%] min-w-[120px] truncate ...">
                                    {liveMarketData[element.instrument_token] == null ? "" : <span className="rupeeSign mr-[2px]">&#8377;</span>}
                                    {liveMarketData[element.instrument_token] == null ? "" : liveMarketData[element.instrument_token].ltp.toFixed(2)}
                                </div>
                                <div className="currentValueEntry flex flex-row justify-center items-center h-full w-[20%] min-w-[120px] truncate ...">
                                    {liveMarketData[element.instrument_token] == null ? "" : <span className="rupeeSign mr-[2px]">&#8377;</span>}
                                    {
                                        liveMarketData[element.instrument_token] == null ? "" :
                                        (element.quantity * liveMarketData[element.instrument_token].ltp).toFixed(2)
                                    }
                                </div>
                                <div className="overallProfitLossEntry flex flex-row justify-center items-center h-full w-[20%] min-w-[120px] truncate ..."
                                id={liveMarketData[element.instrument_token] != null && liveMarketData[element.instrument_token].ltp - element.average_price > 0 ?
                                "positiveOverallProfitLossEntry" : "negativeOverallProfitLossEntry"}>
                                    {liveMarketData[element.instrument_token] == null ? "" : <span className="rupeeSign mr-[2px]">&#8377;</span>}
                                    {liveMarketData[element.instrument_token] != null && liveMarketData[element.instrument_token].ltp - element.average_price > 0 ? "+" : ""}
                                    {
                                        liveMarketData[element.instrument_token] == null ? "" :
                                        ((((liveMarketData[element.instrument_token].ltp - element.average_price) * element.quantity) * 100) / 100).toFixed(2)
                                    }
                                </div>
                                <div className="overallPercentageEntry flex flex-col justify-center items-center h-full w-[20%] min-w-[120px] truncate ..."
                                id={liveMarketData[element.instrument_token] != null && liveMarketData[element.instrument_token].ltp - element.average_price > 0 ?
                                "positiveOverallPercentageEntry" : "negativeOverallPercentageEntry"}>
                                    {
                                        liveMarketData[element.instrument_token] != null && liveMarketData[element.instrument_token].ltp - element.average_price > 0 ?
                                        "+" : ""
                                    }
                                    {
                                        liveMarketData[element.instrument_token] == null ? "" :
                                        (((
                                            (liveMarketData[element.instrument_token].ltp - element.average_price)
                                            / element.average_price * element.quantity * 100) * 100) / 100).toFixed(2) + "%"
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}