"use client";
import { useEffect } from 'react';
import UserProfile from './UserProfile';
import { useChartsStore } from '../../../zustand/useChartsStore';
import ChartsTab from './ChartsTab';
import OrdersTab from './OrdersTab';
import PositionsTab from './PositionsTab';
import HoldingsTab from './HoldingsTab';
import './styles/ChartsSection.css';

export default function ChartsSection() {

    const {currentOption, setCurrentOption} = useChartsStore();
    const options = ['Charts', 'Orders', 'Positions', 'Holdings'];

    useEffect(() => {
    }, []);

    const changeOption = (event) => {
        const textContent = event.target.textContent;
        setCurrentOption(textContent);
    }

    return (
        <div className="chartsSection flex flex-col w-full">
            <div className="navBar w-full flex flex-row min-h-[61px] max-h-[61px] border-black border-t-[1px] border-r-[1px] border-b-[1px]">
                <div className="options flex flex-row justify-center items-center">
                    {
                        options.map(element =>
                            <button className="option h-[70%] text-[18px] font-[400] ml-[15px] mr-[5px]"
                                id={currentOption == element ? "chosenOption" : "option"} key={element}
                                onClick={changeOption}>
                                {element}
                            </button>
                        )
                    }
                </div>

                <UserProfile />
            </div>

            {
                currentOption == 'Charts' ?
                <ChartsTab /> :
                <></>
            }
            {
                currentOption == 'Orders' ?
                <OrdersTab /> :
                <></>
            }
            {
                currentOption == 'Positions' ?
                <PositionsTab /> :
                <></>
            }
            {
                currentOption == 'Holdings' ?
                <HoldingsTab /> :
                <></>
            }
        </div>
    );
}