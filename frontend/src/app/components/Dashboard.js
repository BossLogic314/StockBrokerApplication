"use client";
import { useEffect } from 'react';
import WatchListsSection from './WatchListsSection';
import ChartsSection from './ChartsSection';
import './styles/Dashboard.css';

export default function Dashboard() {

    useEffect(() => {

    }, []);

    return (
        <div className="home h-screen w-screen flex flex-row">
            <WatchListsSection />
            <ChartsSection />
        </div>
    );
}