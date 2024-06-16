"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useUserDataStore } from '../../../zustand/useUserDataStore';
import { useLoadingStore } from '../../../zustand/useLoadingStore';
import { useRouter } from 'next/navigation';
import './styles/UserProfile.css';

export default function UserProfile() {

    const {userData, setUserData} = useUserDataStore();
    const {setLoading} = useLoadingStore();
    const [showUserInformation, setShowUserInformation] = useState(false);
    const router = useRouter();

    const getUserInformation = (async () => {

        try {
            const response = await axios.get('http://localhost:8088/user/getUserInformation',
            {
                withCredentials: true
            });
            setUserData(response.data.response.data);
            setLoading(false);
        }
        // The user needs to login again
        catch(error) {
            router.replace('/');
        }
    });

    useEffect(() => {
        getUserInformation();
    }, []);

    const userProfileClicked = (event) => {
        setShowUserInformation(!showUserInformation);
    }

    const signOutButtonClicked = (event) => {
        console.log('Signout button clicked');
    }

    return (
        <div className="userProfileButton mx-[15px] flex grow justify-end">
            <div className="imageDiv h-full w-[55px] h-[55px] w-[55px]">
                <img className="rounded-full border-black border-[1px] hover:cursor-pointer hover:scale-[1.03] active:scale-[1]"
                src="https://chat-application-display-pictures-bucket.s3.ap-south-1.amazonaws.com/default.jpg"
                onClick={userProfileClicked}>
                </img>
            </div>
            {
                showUserInformation ?
                <div className="profileInformation absolute flex flex-col justify-center items-center ml-[50px] z-[2] top-[62px] right-[15px] rounded-[8px] shadow-[2px_10px_28px_-16px]"
                id="profileInformation">
                    <div className="username text-[18px] font-[500] mt-[3px] mx-[10px]" id="username">{userData.user_name}</div>
                    <div className="emailId text-[15px] mx-[10px]" id="emailId">{userData.email}</div>
                    <button className="signOutButton text-white bg-red-700 hover:bg-red-600 font-[450] rounded-[8px] text-[15px] mt-[5px] mb-[8px] px-[10px] py-[2px] hover:scale-[1.04] active:scale-[1]"
                    id="signOutButton"
                    onClick={signOutButtonClicked}>
                        Sign out
                    </button>
                </div> :
                <></>
            }
        </div>
    );
}