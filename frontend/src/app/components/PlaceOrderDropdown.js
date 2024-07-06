"use client";
import { useEffect, useState } from 'react';
import { usePlaceOrderDropdownStore } from '../../../zustand/usePlaceOrderDropdownStore';
import { usePlaceOrderCautionMessageStore } from '../../../zustand/usePlaceOrderCautionMessageStore';
import { signOut } from '../../../utils/UserProfile';
import './styles/PlaceOrderDropdown.css';
import axios from 'axios';

export default function PlaceOrderDropdown({stock, toBuy}) {

    const [isDropdownLoading, setIsDropdownLoading] = useState(true);
    const {liveMarketDataOfOrderingStock, setDisplayPlaceOrderDropdown} = usePlaceOrderDropdownStore();
    const [product, setProduct] = useState('DELIVERY');
    const [orderType, setOrderType] = useState('MARKET');
    const [isAfterMarketOrder, setIsAfterMarketOrder] = useState(false);
    const [availableFunds, setAvailableFunds] = useState(null);
    const [requiredFunds, setRequiredFunds] = useState(null);
    const [stockQuantity, setStockQuantity] = useState(1);
    const [limitOrderPrice, setLimitOrderPrice] = useState(1);
    const {setShowPlaceOrderCautionMessage, orderDetails, setOrderDetails} = usePlaceOrderCautionMessageStore();

    const products = ['DELIVERY', 'INTRADAY'];
    const orderTypes = ['MARKET', 'LIMIT'];

    const getFundsAndMargin = async() => {
        try {
            const response = await axios.get('http://localhost:8088/user/getFundsAndMargin',
            {
                withCredentials: true
            });
            setAvailableFunds(Number(response.data.fundsAndMargin.data.equity.available_margin.toFixed(2)));
        }
        // Unable to fetch this information
        catch(error) {
            console.log(error);
        }
        setIsDropdownLoading(false);
    }

    const placeOrderButtonClicked = async (event) => {
        const order = {
            product: product,
            orderType: orderType,
            isAfterMarketOrder: isAfterMarketOrder,
            stockQuantity: stockQuantity,
            limitOrderPrice: limitOrderPrice
        }
        setOrderDetails(order);
        setShowPlaceOrderCautionMessage(true);
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

    const afterMarketHoursButtonClicked = (event) => {
        setIsAfterMarketOrder(!isAfterMarketOrder);
    }

    const changeStockQuantity = (event) => {

        const newStockQuantity = Number(event.target.value);

        // Not an integer or less than 1
        if (!Number.isInteger(newStockQuantity) || newStockQuantity < 0 || newStockQuantity > 100) {
            return;
        }
        setStockQuantity(newStockQuantity);
    }

    const changeLimitOrderPrice = (event) => {

        const newLimitOrderPrice = Number(event.target.value);

        if (newLimitOrderPrice < 0) {
            return;
        }
        setLimitOrderPrice(newLimitOrderPrice);
    }

    useEffect(() => {

        if (orderType == 'MARKET') {

            // Market data did not load yet
            if (liveMarketDataOfOrderingStock == null) {
                setRequiredFunds(null);
                return;
            }
            const newRequiredFundsValue = (stockQuantity * liveMarketDataOfOrderingStock.ltp).toFixed(2);
            setRequiredFunds(Number(newRequiredFundsValue));
        }
        else {
            const newRequiredFundsValue = (stockQuantity * limitOrderPrice).toFixed(2);
            setRequiredFunds(Number(newRequiredFundsValue));
        }
    }, [stockQuantity, orderType, limitOrderPrice, liveMarketDataOfOrderingStock])

    useEffect(() => {
        getFundsAndMargin();
    }, []);

    return (
        isDropdownLoading ? <></> :
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
                                    type="number" min="1" value={limitOrderPrice} onChange={changeLimitOrderPrice}>
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

                <div className="orderTime mt-[12px] flex flex-col justify-center">
                    <div className="orderTimeText text-center text-[16px] font-[450]">Order Time</div>
                    <hr className="text-center w-[70%] mt-[2px] ml-[15%] mr-[15%]" id="horizontalLine"></hr>
                    <div className="orderTimeButton text-[16px] text-center rounded-[4px] mx-[15px] mt-[9px] px-[6px] py-[4px] hover:cursor-pointer"
                        id={isAfterMarketOrder ? "chosenAfterMarketHoursButton" : "afterMarketHoursButton"} onClick={afterMarketHoursButtonClicked}>
                        AFTER MARKET HOURS
                    </div>
                </div>

                {
                    !toBuy ? <></> :
                    <div className="fundsAndPrice flex flex-row mt-[12px]">
                        <div className="requiredFunds flex-grow text-center truncate ...">
                            {requiredFunds == null ? "" : "Required: "}
                            {requiredFunds == null ? "" : <span className="rupeeSign mr-[2px]">&#8377;</span>}
                            {requiredFunds == null ? "" : requiredFunds}
                        </div>
                        <div className="availableFunds flex-grow text-center truncate ...">
                            {availableFunds == null ? "" : "Available: "}
                            {availableFunds == null ? "" : <span className="rupeeSign mr-[2px]">&#8377;</span>}
                            {availableFunds == null ? "" : availableFunds}
                        </div>
                    </div>
                }
                {
                    toBuy && availableFunds == null ?
                    <div className="notEnoughAvailableFundsMessage mt-[5px] mx-[10px] text-[17px] text-center italic"
                        id="notEnoughAvailableFundsMessage">
                        Unable to fetch available funds from upstox's server at this hour. Please try again later, preferably during market hours
                    </div> :
                    toBuy && requiredFunds > availableFunds ?
                    <div className="notEnoughAvailableFundsMessage mt-[5px] mx-[10px] text-[17px] text-center italic"
                        id="notEnoughAvailableFundsMessage">
                        Please add more funds to your account to place this order
                    </div> :
                    orderType == 'LIMIT' && limitOrderPrice == 0 ?
                    <div className="limitOrderPriceZeroMessage mt-[5px] mx-[10px] text-[17px] text-center italic"
                        id="limitOrderPriceZeroMessage">
                        Price cannot be '0'
                    </div> :
                    <div className={toBuy ? "mt-[5px] flex justify-center" : "mt-[15px] flex justify-center"}>
                        <div className="placeOrderButton w-[90%] text-[16px] font-[500] rounded-[4px] mx-[10px] px-[6px] py-[4px] text-center hover:cursor-pointer"
                            id={toBuy ? "buyButton" : "sellButton"} onClick={placeOrderButtonClicked}>
                            {toBuy ? "BUY STOCK" : "SELL STOCK"}
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}