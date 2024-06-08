"use client";
import { useEffect } from 'react';
import UserProfile from './UserProfile';
import './styles/ChartsSection.css'

export default function ChartsSection() {

    useEffect(() => {

    }, []);

    return (
        <div className="chartsSection w-full">
            <div className="navBar w-full flex flex-row h-[60px] border-black border-[1px]">
                <div className="options flex flex-row justify-center">
                    <button className="charts text-[17px] ml-[20px]" id="charts">Charts</button>
                    <button className="orders text-[17px] ml-[20px]" id="orders">Orders</button>
                    <button className="positions text-[17px] ml-[20px]" id="positions">Positions</button>
                    <button className="holdings text-[17px] ml-[20px] mr-[15px]" id="holdings">Holdings</button>
                </div>

                <UserProfile />
            </div>
        </div>
    );
}