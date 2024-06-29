"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlaceOrderDropdownStore } from '../../../zustand/usePlaceOrderDropdownStore';
import { signOut } from '../../../utils/UserProfile';
import './styles/PlaceOrderDropdown.css';
import axios from 'axios';

export default function PlaceOrderDropdown({stock, toBuy}) {

    const {liveMarketDataOfOrderingStock, setDisplayPlaceOrderDropdown} = usePlaceOrderDropdownStore();
    const [product, setProduct] = useState('DELIVERY');
    const [orderType, setOrderType] = useState('MARKET');
    const [availableFunds, setAvailableFunds] = useState(null);
    const [requiredFunds, setRequiredFunds] = useState(null);
    const [stockQuantity, setStockQuantity] = useState(1);
    const [limitOrderPrice, setLimitOrderPrice] = useState(1);

    const products = ['DELIVERY', 'INTRADAY'];
    const orderTypes = ['MARKET', 'LIMIT'];

    const getFundsAndMargin = async() => {
        try {
            const response = await axios.get('http://localhost:8088/user/getFundsAndMargin',
            {
                withCredentials: true
            });
            setAvailableFunds(response.data.fundsAndMargin.data.equity.available_margin.toFixed(2));
        }
        // The user has to login again
        catch(error) {
            signOut();
        }
    }

    const closeButtonClicked = () => {
        setDisplayPlaceOrderDropdown(false);
    }

    const productButtonClicked = (event) => {
        setProduct(event.target.textContent);
    }

    const orderTypeButtonClicked = (event) => {
        setOrderType(event.target.textContent);
    }

    const changeStockQuantity = (event) => {

        const newStockQuantity = Number(event.target.value);

        // Not an integer or less than 1
        if (!Number.isInteger(newStockQuantity) || newStockQuantity < 0 || newStockQuantity > 100) {
            return;
        }
        setStockQuantity(newStockQuantity);
    }

    const placeOrder = async (event) => {
        console.log(event.target.id);

        try {
            const response = await axios.get('http://localhost:8088/user/getOrders',
            {
                withCredentials: true
            });
            console.log(response);
        }
        // The user has to login again
        catch(error) {
            console.log(error);
            //signOut();
        }
    }

    useEffect(() => {
        if (orderType == 'MARKET') {
            const newRequiredFundsValue = (stockQuantity * liveMarketDataOfOrderingStock.ltp).toFixed(2);
            setRequiredFunds(newRequiredFundsValue);
        }
        else {
            const newRequiredFundsValue = (stockQuantity * limitOrderPrice).toFixed(2);
            setRequiredFunds(newRequiredFundsValue);
        }
    }, [stockQuantity, orderType, limitOrderPrice])

    useEffect(() => {
        getFundsAndMargin();
    }, []);

    return (
        <div className="placeOrder h-full w-[30px] absolute top-0 left-[340px] w-[350px] flex flex-col z-10" id="placeOrder">
            <div className="header w-full h-[60px] flex flex-row border-black border-t-[1px] border-r-[1px] border-b-[1px]">
                <div className="heading w-[85%] text-[22px] font-[400] pl-[12px] rounded-[5px] flex items-center">
                    Place order
                </div>

                <div className="closePlaceOrderDropdownDiv flex flex-col justify-center">
                    <div className="closePlaceOrderDropdownButtonDiv h-[35px] w-[35px] mr-[5px] text-[20px] rounded-full flex flex-col items-center justify-center hover:cursor-pointer"
                        id="closePlaceOrderDropdownButtonDiv" onClick={closeButtonClicked}>
                        X
                    </div>
                </div>
            </div>

            <div className="h-[65px] flex flex-row border-black border-b-[1px] border-r-[1px]"
                id="stockToPlaceOrderOn">
                <div className="min-w-[70%] flex flex-col justify-center pl-[12px] pr-[5px]">
                    <div className="name text-[17px] font-[450] truncate ...">
                        {stock.name}
                    </div>
                    <div className="text-[12px] font-[360] truncate ...">
                        {stock.exchange}
                    </div>
                </div>

                <div className="w-full mr-[5%] mt-[2px]">
                    <div className="price h-[50%] text-[16px] pt-[7px] font-[450] flex justify-end truncate ..."
                    id={liveMarketDataOfOrderingStock?.close1D > liveMarketDataOfOrderingStock?.open1D ? "positivePrice" : "negativePrice"}>
                        {liveMarketDataOfOrderingStock == null ? "" : <span className="rupeeSign mr-[2px]">&#8377;</span>}
                        {liveMarketDataOfOrderingStock == null ? "" : liveMarketDataOfOrderingStock.ltp}
                    </div>
                    <div className="growth h-[50%] text-[13px] flex justify-end truncate ..."
                        id={liveMarketDataOfOrderingStock?.close1D > liveMarketDataOfOrderingStock?.open1D ?
                            "positiveGrowth" : "negativeGrowth"}>
                        {
                            liveMarketDataOfOrderingStock?.close1D >
                            liveMarketDataOfOrderingStock?.open1D ?
                            ("+") : ("")
                        }
                        {
                            isNaN(((liveMarketDataOfOrderingStock?.close1D - liveMarketDataOfOrderingStock?.open1D) /
                                        liveMarketDataOfOrderingStock?.open1D * 100).toFixed(2)) ? "" :
                                    ((liveMarketDataOfOrderingStock?.close1D - liveMarketDataOfOrderingStock?.open1D) /
                                        liveMarketDataOfOrderingStock?.open1D * 100).toFixed(2)
                        }
                        {
                            isNaN(((liveMarketDataOfOrderingStock?.close1D - liveMarketDataOfOrderingStock?.open1D) /
                                liveMarketDataOfOrderingStock?.open1D * 100).toFixed(2)) ? "" : "%"
                        }
                    </div>
                </div>
            </div>

            <div className="orderDetails flex-grow border-black border-r-[1px] overflow-y-auto">
                <div className="productButtons mt-[12px] flex flex-row justify-center">
                    {
                        products.map((element) => (
                            <div className="productButton text-[16px] rounded-[4px] mx-[8px] px-[6px] py-[4px] hover:cursor-pointer"
                                id={product == element ? "chosenProductButton" : "productButton"} onClick={productButtonClicked} key={element}>
                                {element}
                            </div>
                        ))
                    }
                </div>

                <div className="quantityAndPrice mt-[8px] flex flex-row">
                    <div className="quantity w-[50%] flex flex-col">
                        <div className="quantityText text-[16px] font-[450] pl-[14px]">Quantity</div>
                        <input className="quantity w-[85%] mt-[3px] ml-[12px] pl-[5px] py-[1px] text-[19px] font-[300] rounded-[4px] border-black border-[1px]"
                            type="number" min="1" value={stockQuantity} onChange={changeStockQuantity}>
                        </input>
                    </div>
                    <div className="price w-[50%]">
                        <div className="priceText text-[16px] font-[450] pl-[14px]">Price</div>
                        {
                            orderType == 'MARKET' ?
                            (
                                <input className="price w-[85%] mt-[3px] ml-[12px] py-[1px] text-[18px] font-[300] rounded-[4px] text-center border-black border-[1px]"
                                    type="text" value="MARKET PRICE" readOnly>
                                </input>
                            ) :
                            (
                                <input className="price w-[85%] mt-[3px] ml-[12px] pl-[5px] py-[1px] text-[19px] font-[300] rounded-[4px] border-black border-[1px]"
                                    type="number" min="1" value={limitOrderPrice} onChange={(e) => (setLimitOrderPrice(e.target.value))}>
                                </input>
                            )
                        }
                    </div>
                </div>

                <div className="orderType mt-[12px] flex flex-col justify-center">
                    <div className="orderTypeText text-center text-[16px] font-[450]">Order Type</div>
                    <hr className="text-center w-[70%] mt-[2px] ml-[15%] mr-[15%]" id="horizontalLine"></hr>
                    <div className="orderTypeButtons mt-[9px] flex flex-row justify-center">
                        {
                            orderTypes.map((element) => (
                                <div className="orderTypeButton text-[16px] rounded-[4px] mx-[10px] px-[6px] py-[4px] hover:cursor-pointer"
                                    id={orderType == element ? "chosenOrderTypeButton" : "orderTypeButton"} onClick={orderTypeButtonClicked}
                                    key={element}>
                                    {element}
                                </div>
                            ))
                        }
                    </div>
                </div>

                {
                    !toBuy ? <></> :
                    <div className="fundsAndPrice flex flex-row mt-[12px]">
                        <div className="requiredFunds flex-grow text-center">
                            {requiredFunds == null ? "" : "Required: "}
                            {requiredFunds == null ? "" : <span className="rupeeSign mr-[2px]">&#8377;</span>}
                            {requiredFunds == null ? "" : requiredFunds}
                        </div>
                        <div className="availableFunds flex-grow text-center">
                            {availableFunds == null ? "" : "Available: "}
                            {availableFunds == null ? "" : <span className="rupeeSign mr-[2px]">&#8377;</span>}
                            {availableFunds == null ? "" : availableFunds}
                        </div>
                    </div>
                }

                <div className={toBuy ? "mt-[5px] flex justify-center" : "mt-[15px] flex justify-center"}>
                    <div className="placeOrderButton w-[90%] text-[16px] font-[500] rounded-[4px] mx-[10px] px-[6px] py-[4px] text-center hover:cursor-pointer"
                        id={toBuy ? "buyButton" : "sellButton"} onClick={placeOrder}>
                        {toBuy ? "BUY STOCK" : "SELL STOCK"}
                    </div>
                </div>
            </div>
        </div>
    );
}