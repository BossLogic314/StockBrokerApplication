"use client";
import { useEffect, useState } from 'react';
import UserProfile from './UserProfile';
import { useChartsStore } from '../../../zustand/useChartsStore';
import { createChart } from 'lightweight-charts';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import './styles/ChartsSection.css';

export default function ChartsSection() {

    const {currentStock, setCurrentStock, currentOption, setCurrentOption, currentScale, setCurrentScale} = useChartsStore();
    const router = useRouter();
    const options = ['Charts', 'Orders', 'Positions', 'Holdings'];
    const scales = ['1 min', '30 min', '1 day', '1 week', '1 month'];

    useEffect(() => {
        // Document has not loaded completely
        if (document.getElementById("chart") == null || currentStock.candles == null) {
            return;
        }

        document.getElementById("chart").innerHTML = "";
        const chartOptions = { layout: { textColor: 'black', background: { type: 'solid', color: 'white' } } };
        const chart = createChart(document.getElementById("chart"), chartOptions);
        const candlestickSeries = chart.addCandlestickSeries({ upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350' });

        //const data = [{ open: 10, high: 10.63, low: 9.49, close: 9.55, time: 1642427876 }, { open: 9.55, high: 10.30, low: 9.42, close: 9.94, time: 1642514276 }, { open: 9.94, high: 10.17, low: 9.92, close: 9.78, time: 1642600676 }, { open: 9.78, high: 10.59, low: 9.18, close: 9.51, time: 1642687076 }, { open: 9.51, high: 10.46, low: 9.10, close: 10.17, time: 1642773476 }, { open: 10.17, high: 10.96, low: 10.16, close: 10.47, time: 1642859876 }, { open: 10.47, high: 11.39, low: 10.40, close: 10.81, time: 1642946276 }, { open: 10.81, high: 11.60, low: 10.30, close: 10.75, time: 1643032676 }, { open: 10.75, high: 11.60, low: 10.49, close: 10.93, time: 1643119076 }, { open: 10.93, high: 11.53, low: 10.76, close: 10.96, time: 1643205476 }];
        const data = [{ time: 1642427876, open: 10, high: 10.63, low: 9.49, close: 9.55 }, { open: 9.55, high: 10.30, low: 9.42, close: 9.94, time: 1642514276 }];

        candlestickSeries.setData(currentStock.candles);
        chart.timeScale().fitContent();

    }, [currentStock]);

    const changeOption = (event) => {
        const textContent = event.target.textContent;
        setCurrentOption(textContent);
    }

    const getCandlesForNewScale = async (textContent) => {
        let interval = null;
        if (textContent == '1 min') {
            interval = '1minute';
        }
        else if (textContent == '30 min') {
            interval = '30minute';
        }
        else if (textContent == '1 day') {
            interval = 'day';
        }
        else if (textContent == '1 week') {
            interval = 'week';
        }
        else {
            interval = 'month';
        }

        let candles = null;
        try {
            const response = await axios.get(
                `http://localhost:8086/marketData/getDataInInterval?instrumentKey=${currentStock.instrumentKey}&interval=${interval}`,
            {
                withCredentials: true
            });
            candles = response.data.candles;
        }
        // The user has to login again
        catch(error) {
            //router.replace('/');
        }

        const obj = {
            instrumentKey: currentStock.instrumentKey,
            name: currentStock.name,
            candles: candles
        }
        setCurrentStock(obj);
    }

    const changeScale = (event) => {
        const textContent = event.target.textContent;
        setCurrentScale(textContent);
        getCandlesForNewScale(textContent);
    }

    return (
        <div className="chartsSection flex flex-col w-full">
            <div className="navBar w-full flex flex-row min-h-[60px] max-h-[60px] border-black border-t-[1px] border-r-[1px] border-b-[1px]">
                <div className="options flex flex-row justify-center items-center">
                    {
                        options.map(element =>
                            <button className="option h-[70%] text-[18px] font-[400] ml-[20px]"
                                id={currentOption == element ? "chosenOption" : "option"}
                                onClick={changeOption}>
                                {element}
                            </button>
                        )
                    }
                </div>

                <UserProfile />
            </div>

            {
                currentStock != null ?
                (
                    <div className="chartsHeader flex flex-col flex-grow h-full">
                        <div className="currentStockName text-[23px] font-[500] ml-[20px] mt-[5px]">{currentStock.name}</div>
                        <div className="scales mt-[5px] flex flex-row">
                            {
                                scales.map(element =>
                                    (
                                        currentScale == element ?
                                        (
                                            <div className="1min rounded-[4px] ml-[20px] px-[5px] text-[15px] hover:cursor-pointer border-black border-[1px]"
                                                id="chosenScale" onClick={changeScale}>
                                                {element}
                                            </div>
                                        ) :
                                        (
                                            <div className="1min rounded-[4px] ml-[20px] px-[5px] text-[15px] hover:cursor-pointer border-black border-[1px]"
                                                id="scale" onClick={changeScale}>
                                                {element}
                                            </div>
                                        )
                                    )
                                )
                            }
                        </div>

                        <div className="chartDiv flex items-center flex-grow">
                            <div className="chart h-[96%] w-full mx-[20px]" id="chart">
                            </div>
                        </div>
                    </div>
                ) :
                <></>
            }
        </div>
    );
}