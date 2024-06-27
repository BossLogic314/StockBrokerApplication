import { useEffect, useState } from "react";
import { signOut } from "../../../utils/UserProfile";
import io from "socket.io-client";
import axios from "axios";
import './styles/HoldingsTab.css';

export default function HoldingsTab() {

    const [holdings, setHoldings] = useState([]);
    const holdingsHeaderFields = ['Symbol', 'Net Qty', 'Avg. Price', 'LTP', 'Current Value', 'Overall P&L', 'Overall %'];
    const [liveMarketData, setLiveMarketData] = useState([]);
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

    const getLiveMarketData = async () => {

        // If no holdings (yet)
        if (holdings.length == 0) {
            return;
        }
        const newSocket = io('http://localhost:8086/');

        newSocket.on('market data', (updatedLiveMarketData) => {

            updatedLiveMarketData = JSON.parse(updatedLiveMarketData);
            let liveMarketDataCopy = [...liveMarketData];

            for (let i = 0; i < updatedLiveMarketData.length; ++i) {
                liveMarketDataCopy[updatedLiveMarketData[i].instrumentKey] = updatedLiveMarketData[i];
            }
            setLiveMarketData(liveMarketDataCopy);
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
            signOut();
        }

        const instrumentKeys = holdings.map(element => element.instrument_token);
        newSocket.emit('market data',
        {
            accessToken: accessToken,
            instrumentKeys: instrumentKeys
        });
    }

    useEffect(() => {
        getHoldings();
    }, []);

    useEffect(() => {
        getLiveMarketData();
    }, [holdings]);

    return (
        <div className="holdingsTab flex flex-col flex-grow my-[20px] mx-[20px] overflow-y-hidden overflow-x-hidden" id="ordersTab">
            <div className="holdingsHeader h-[50px] flex flex-row" id="ordersHeader">
                {
                    holdingsHeaderFields.map((element, index) => (
                        <div className="holdingsHeaderField w-[20%] min-w-[120px] text-[16px] font-[500] flex justify-center items-center" key={index}>
                            {element == 'Symbol' ? `Symbol (${holdings.length})` : element}
                        </div>
                    ))
                }
            </div>

            <div className="holdings flex-grow overflow-y-auto overflow-x-hidden" id="orders">
                {
                    holdings.map((element, index) => (
                        <div className="holding h-[65px] flex flex-row" key={index} id="order">
                            <div className="symbolEntry flex flex-col justify-center items-center h-full w-[20%] min-w-[120px]">
                                <div className="symbolNameEntry text-[15px] font-[500] truncate ...">{element.tradingsymbol}</div>
                                <div className="symbolExchangeEntry text-[11px] font-[360] truncate ...">{`${element.exchange}_INDEX`}</div>
                            </div>
                            <div className="netQuantityEntry flex flex-col justify-center items-center h-full w-[20%] min-w-[120px] truncate ...">
                                {element.quantity}
                            </div>
                            <div className="averagePriceEntry flex flex-col justify-center items-center h-full w-[20%] min-w-[120px] truncate ...">
                                {element.average_price}
                            </div>
                            <div className="ltpEntry flex flex-col justify-center items-center h-full w-[20%] min-w-[120px] truncate ...">
                                {"ltp"}
                            </div>
                            <div className="averagePriceEntry flex flex-col justify-center items-center h-full w-[20%] min-w-[120px] truncate ...">
                                {element.average_price}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}