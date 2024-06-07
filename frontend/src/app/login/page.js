"use client";
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Login() {

    const searchParams = useSearchParams();
    const router = useRouter();

    const getAccessToken = async () => {
        try {
            const authCode = searchParams.get('code');
            const response = await axios.get(`http://localhost:8085/auth/getAccessTokenInCookie?authCode=${authCode}`,
            {
                withCredentials: true
            });
            console.log(response);
        }
        // Creation of access token failed
        catch(error) {
            console.log(error);
        }

        // Forwarding to the dashboard page anyway. Jwt will be verified in the dashboard page
        router.replace('/dashboard');
    }

    useEffect(() => {
        getAccessToken();
    },[]);

    return (
        <div></div>
    );
}