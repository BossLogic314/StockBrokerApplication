"use client";
import axios from 'axios';
import { useEffect } from 'react';
import { useShowDeleteWatchListWarningStore } from '../../../zustand/useShowDeleteWatchListWarningStore';
import { useWatchListStore } from '../../../zustand/useWatchListStore';
import { useUserDataStore } from '../../../zustand/useUserDataStore';
import { useRouter } from 'next/navigation';
import { signOut } from '../../../utils/UserProfile';
import './styles/DeleteWatchListWarning.css';

export default function DeleteWatchListWarning({getWatchLists}) {

    const {userData, setUserData} = useUserDataStore();
    const {currentWatchListIndex, setCurrentWatchListIndex, setCurrentWatchList} = useWatchListStore();
    const {setShowDeleteWatchListWarning} = useShowDeleteWatchListWarningStore();
    const router = useRouter();

    const deleteButtonClicked = async (event) => {

        // Adding the stock in the watchlist in the database
        try {
            const response = await axios.post('http://localhost:8087/watchLists/deleteWatchList',
            {
                userId: userData.user_id,
                watchListIndex: currentWatchListIndex
            },
            {
                withCredentials: true
            });
        }
        // The user needs to login again
        catch(error) {
            signOut();
        }

        // Updating watchlists and the current watchlist
        const newWatchLists = await getWatchLists();
        if (newWatchLists == []) {
            setCurrentWatchList(null);
        }
        else {
            setCurrentWatchList(newWatchLists[0]);
        }
        setCurrentWatchListIndex(0);

        setShowDeleteWatchListWarning(false);
    }

    const cancelButtonClicked = (event) => {
        setShowDeleteWatchListWarning(false);
    }

    useEffect(() => {

    }, []);

    return (
        <div className="deleteWatchListWarningOverlay fixed flex flex-col items-center top-[60px] left-0 h-full w-[340px]" id="deleteWatchListWarningOverlay">
            <div className="deleteWatchListWarningDiv w-[90%] mt-[10px] rounded-[4px]" id="deleteWatchListWarningDiv">
                <div className="message mt-[10px] px-[5px] text-center text-[20px]">
                    Are you sure you want to delete the watchlist?
                </div>
                <div className="buttonsDiv flex flex-row justify-center text-[20px] mt-[10px] pb-[10px]">
                    <button className="deleteButton px-[10px] mr-[10px] rounded-[4px]" onClick={deleteButtonClicked} id="deleteButton">Delete</button>
                    <button className="cancelButton px-[10px] ml-[10px] rounded-[4px]" onClick={cancelButtonClicked} id="cancelButton">Cancel</button>
                </div>
            </div>
        </div>
    );
}