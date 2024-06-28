import { useEffect, useState } from "react";
import { signOut } from "../../../utils/UserProfile";
import io from "socket.io-client";
import axios from "axios";
import './styles/HoldingsTab.css';

export default function HoldingsTab() {

    const [holdings, setHoldings] = useState([]);
    const holdingsHeaderFields = ['Symbol', 'Net Qty', 'Avg. Price', 'LTP', 'Current Value', 'Overall P&L', 'Overall %'];
    const [liveMarketData, setLiveMarketData] = useState({
        'NSE_EQ|INE645W01026': {
            ltp: 31.07
        },
        'NSE_EQ|INE669E01016': {
            ltp: 17.89
        }
    });
    const [socket, setSocket] = useState(null);

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
        getHoldings();
    }, []);

    console.log(holdings);
    return (
        <div className="holdingsTab flex flex-col flex-grow my-[20px] mx-[20px] overflow-y-hidden overflow-x-hidden" id="holdingsTab">
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
                                {element.average_price}
                            </div>
                            <div className="ltpEntry flex flex-row justify-center items-center h-full w-[20%] min-w-[120px] truncate ...">
                                {liveMarketData[element.instrument_token] == null ? "" : <span className="rupeeSign mr-[2px]">&#8377;</span>}
                                {liveMarketData[element.instrument_token] == null ? "" : liveMarketData[element.instrument_token].ltp}
                            </div>
                            <div className="currentValueEntry flex flex-row justify-center items-center h-full w-[20%] min-w-[120px] truncate ...">
                                {liveMarketData[element.instrument_token] == null ? "" : <span className="rupeeSign mr-[2px]">&#8377;</span>}
                                {
                                    liveMarketData[element.instrument_token] == null ? "" :
                                    element.quantity * liveMarketData[element.instrument_token].ltp
                                }
                            </div>
                            <div className="overallProfitLossEntry flex flex-row justify-center items-center h-full w-[20%] min-w-[120px] truncate ...">
                                {liveMarketData[element.instrument_token] == null ? "" : <span className="rupeeSign mr-[2px]">&#8377;</span>}
                                {
                                    liveMarketData[element.instrument_token] == null ? "" :
                                    ((((liveMarketData[element.instrument_token].ltp - element.average_price) * element.quantity) * 100) / 100).toFixed(2)
                                }
                            </div>
                            <div className="overallPercentageEntry flex flex-col justify-center items-center h-full w-[20%] min-w-[120px] truncate ...">
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
    )
}