"use client";
import { useEffect } from 'react';
import { useChartsStore } from '../../../zustand/useChartsStore';
import { createChart } from 'lightweight-charts';
import axios from 'axios';
import { signOut } from '../../../utils/UserProfile';
import './styles/ChartsTab.css';

export default function ChartsSection() {

    const {currentStock, setCurrentStock, currentScale, setCurrentScale} = useChartsStore();
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

        candlestickSeries.setData(currentStock.candles);
        chart.timeScale().fitContent();

    }, [currentStock]);

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
        // When unable to fetch candle data, not displaying anything
        catch(error) {
            console.log(error);
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
        currentStock != null ?
        (
            <div className="chartsHeader flex flex-col flex-grow h-full">
                <div className="currentStockName text-[25px] font-[500] ml-[15px] mr-[5px] mt-[5px] py-[2px]">{currentStock.name}</div>
                <div className="scales mt-[5px] flex flex-row">
                    {
                        scales.map(element =>
                            (
                                currentScale == element ?
                                (
                                    <div className="rounded-[4px] ml-[15px] mr-[5px] px-[5px] text-[15px] hover:cursor-pointer border-black border-[1px]"
                                        id="chosenScale" onClick={changeScale} key={element}>
                                        {element}
                                    </div>
                                ) :
                                (
                                    <div className="rounded-[4px] ml-[15px] mr-[5px] px-[5px] text-[15px] hover:cursor-pointer border-black border-[1px]"
                                        id="scale" onClick={changeScale} key={element}>
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
    );
}