"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlaceOrderDropdownStore } from '../../../zustand/usePlaceOrderDropdownStore';
import './styles/PlaceOrderDropdown.css';

export default function PlaceOrderDropdown({stock}) {

    const {liveMarketDataOfOrderingStock, setDisplayPlaceOrderDropdown} = usePlaceOrderDropdownStore();
    const [product, setProduct] = useState('DELIVERY');
    const router = useRouter();

    const products = ['DELIVERY', 'INTRADAY'];

    const closeButtonClicked = () => {
        setDisplayPlaceOrderDropdown(false);
    }

    const productButtonClicked = (event) => {
        setProduct(event.target.textContent);
    }

    useEffect(() => {

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

            <div className="h-[65px] flex flex-row hover:cursor-pointer border-black border-b-[1px] border-r-[1px]"
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
                        id={liveMarketDataOfOrderingStock?.close1D > liveMarketDataOfOrderingStock?.open1D ?
                            "positivePrice" : "negativePrice"}>
                        {
                            liveMarketDataOfOrderingStock?.ltp
                        }
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
                            ((liveMarketDataOfOrderingStock?.close1D - liveMarketDataOfOrderingStock?.open1D) /
                                liveMarketDataOfOrderingStock.open1D * 100).toFixed(2)
                        }
                        %
                    </div>
                </div>
            </div>

            <div className="orderDetails flex-grow border-black border-r-[1px]">
                <div className="productButtons mt-[12px] flex flex-row justify-center">
                    {
                        products.map((element) => (
                            <div className="productButton text-[16px] rounded-[4px] mr-[8px] px-[6px] py-[4px] hover:cursor-pointer"
                                id={product == element ? "chosenProductButton" : "productButton"} onClick={productButtonClicked}>
                                {element}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}