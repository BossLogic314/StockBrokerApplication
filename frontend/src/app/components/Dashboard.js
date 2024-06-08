"use client";
import { useEffect } from 'react';
import './styles/Dashboard.css';
import WatchListsSection from './WatchListsSection';
import ChartsSection from './ChartsSection';

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