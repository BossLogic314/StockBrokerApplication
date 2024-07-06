"use client";
import { usePlaceOrderCautionMessageStore } from '../../../zustand/usePlaceOrderCautionMessageStore';
import axios from 'axios';
import './styles/PlaceOrderCautionMessage.css';

export default function PlaceOrderCautionMessage() {

    const {setShowPlaceOrderCautionMessage, orderDetails, setOrderDetails} = usePlaceOrderCautionMessageStore();

    const placeOrder = async() => {
        try {
            const response = await axios.post('http://localhost:8088/user/placeOrder',
            orderDetails,
            {
                withCredentials: true
            });
        }
        // Something went wrong
        catch(error) {
            alert('Something went wrong. Please check your order and try again!');
        }
        setShowPlaceOrderCautionMessage(false);
    }

    const closePlaceOrderCautionMessage = (event) => {

        if (event.target.id != 'cautionMessage' && event.target.id != 'orderSubmitButton') {
            setOrderDetails(null);
            setShowPlaceOrderCautionMessage(false);
        }
    }

    return (
        <div className='h-screen w-screen min-h-[700px] min-w-[850px] flex flex-col absolute top-0 bottom-0 left-0 right-0 z-10'
        id="placeOrderCautionMessageOverlay" onClick={closePlaceOrderCautionMessage}>
            {
                orderDetails == null ? <></> :
                <div className="cautionDiv mt-[30px] flex flex-col justify-center items-center">
                    <div className="cautionMessage text-[30px]" id="cautionMessage">Are you sure you want to place this order?</div>
                    <div className="buttonsDiv flex flex-row justify-center text-[22px] mt-[10px] pb-[10px]">
                        <button className="orderSubmitButton px-[10px] py-[5px] mr-[10px] rounded-[5px]" onClick={placeOrder}
                        id="orderSubmitButton">
                            Submit
                        </button>
                        <button className="orderCancelButton px-[10px] py-[5px] ml-[10px] rounded-[5px]" onClick={closePlaceOrderCautionMessage}
                        id="orderCancelButton">
                            Cancel
                        </button>
                    </div>
                </div>
            }
        </div>
    );
}