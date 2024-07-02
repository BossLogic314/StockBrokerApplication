"use client";
import { useEffect } from 'react';
import WatchListsSection from './WatchListsSection';
import ChartsSection from './ChartsSection';
import PlaceOrderCautionMessage from './PlaceOrderCautionMessage';
import { usePlaceOrderCautionMessageStore } from '../../../zustand/usePlaceOrderCautionMessageStore';
import './styles/Dashboard.css';

export default function Dashboard() {

    const {showPlaceOrderCautionMessage, setShowPlaceOrderCautionMessage} = usePlaceOrderCautionMessageStore();

    useEffect(() => {

    }, []);

    return (
        <div className="home h-screen w-screen flex flex-row">
            <WatchListsSection />
            <ChartsSection />
            {
                showPlaceOrderCautionMessage ?
                <PlaceOrderCautionMessage /> :
                <></>
            }
        </div>
    );
}