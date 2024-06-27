import { useEffect, useState } from "react";
import { signOut } from "../../../utils/UserProfile";
import axios from "axios";
import './styles/OrdersTab.css';

export default function OrdersTab() {

    const [orders, setOrders] = useState([]);
    const ordersHeaderFields = ['STOCK', 'TYPE', 'STATUS', 'QUANTITY', 'PRICE', 'TRIGGER PRICE'];

    const getOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8088/user/getOrderBook',
            {
                withCredentials: true
            });
            console.log(response);
            setOrders(response.data.orders.data);
        }
        // The user has to login again
        catch(error) {
            signOut();
        }
    }

    useEffect(() => {
        getOrders();
    }, []);

    console.log(orders);
    return (
        <div className="ordersTab flex flex-col flex-grow my-[20px] mx-[20px] overflow-y-hidden" id="ordersTab">
            <div className="ordersHeader h-[50px] flex flex-row" id="ordersHeader">
                {
                    ordersHeaderFields.map((element, index) => (
                        <div className="ordersHeaderField w-[20%] min-w-[120px] text-[16px] font-[500] flex justify-center items-center" key={index}>
                            {element == 'STOCK' ? `STOCK (${orders.length})` : element}
                        </div>
                    ))
                }
            </div>

            <div className="orders flex-grow overflow-y-auto" id="orders">
                {
                    orders.map((element, index) => (
                        <div className="order h-[65px] flex flex-row" key={index} id="order">
                            <div className="stockEntry flex flex-col justify-center items-center h-full w-[20%] min-w-[120px]">
                                <div className="stockNameEntry text-[14px] font-[500] truncate ...">{element.tradingsymbol}</div>
                                <div className="stockExchangeEntry text-[11px] font-[360] truncate ...">{`${element.exchange}_INDEX`}</div>
                            </div>
                            <div className="typeEntry flex justify-center items-center h-full w-[20%] min-w-[120px] truncate ...">
                                <div className="typeText px-[12px] py-[4px] rounded-[10px] text-[16px] font-[500]"
                                    id={element.transaction_type == 'BUY' ? 'buyText' : 'sellText'}>
                                    {element.transaction_type}
                                </div>
                            </div>
                            <div className="statusEntry flex justify-center items-center h-full w-[20%] min-w-[120px] truncate ...">
                                <div className="statusText w-[100px] px-[12px] py-[4px] rounded-[10px] text-center truncate ..."
                                    id={element.status == 'complete' ? 'complete' : element.status == 'cancelled' ? 'cancelled' : element.status == 'rejected' ? 'rejected' : 'amo'}>
                                    {element.status == 'complete' ? 'Complete' : element.status == 'cancelled' ? 'Cancelled' : element.status == 'rejected' ? 'Rejected' : 'AMO'}
                                </div>
                            </div>
                            <div className="quantityEntry flex justify-center items-center h-full w-[20%] min-w-[120px] truncate ...">
                                {element.quantity}
                            </div>
                            <div className="priceEntry flex justify-center items-center h-full w-[20%] min-w-[120px] truncate ...">
                                <span className="rupeeSign mr-[2px]">&#8377;</span>
                                {(Math.round(element.price * 100) / 100).toFixed(2)}
                            </div>
                            <div className="triggerPriceEntry flex justify-center items-center h-full w-[20%] min-w-[120px] truncate ...">
                                <span className="rupeeSign mr-[2px]">&#8377;</span>
                                {(Math.round(element.price * 100) / 100).toFixed(2)}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}