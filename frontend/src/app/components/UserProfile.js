"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';
import './styles/UserProfile.css';

export default function UserProfile() {

    const [userData, setUserData] = useState(null);
    const [showUserInformation, setShowUserInformation] = useState(false);

    const getUserInformation = (async () => {
        const response = await axios.get('http://localhost:8088/user/getUserInformation',
        {
            withCredentials: true
        });

        setUserData(response.data);
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

    console.log(userData);
    return (
        <div className="userProfileButton mr-[15px] flex grow justify-end">
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
                    <div className="username text-[18px] font-[500] mt-[3px] mx-[10px]" id="username">{userData.response.data.user_name}</div>
                    <div className="emailId text-[15px] mx-[10px]" id="emailId">{userData.response.data.email}</div>
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