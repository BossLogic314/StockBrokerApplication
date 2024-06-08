"use client";
import { useEffect } from 'react';
import UserProfile from './UserProfile';

export default function ChartsSection() {

    useEffect(() => {

    }, []);

    return (
        <div className="chartsSection w-full">
            <div className='navBar w-full flex flex-row h-[60px] border-black border-[1px]'>
                <div className='options flex justify-center'>
                    <button className='charts text-[17px] ml-[20px]'>Charts</button>
                    <button className='orders text-[17px] ml-[20px]'>Orders</button>
                    <button className='positions text-[17px] ml-[20px]'>Positions</button>
                    <button className='holdings text-[17px] ml-[20px] mr-[15px]'>Holdings</button>
                </div>

                <UserProfile />
            </div>
        </div>
    );
}