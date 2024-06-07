"use client";
import axios from 'axios';
import Dashboard from '../components/Dashboard';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Login() {

    const [loadingStatus, setLoadingStatus] = useState(true);
    const router = useRouter();

    // To verify whether the user has access
    const verifyJwtToken = (async () => {
        try {
            const response = await axios.post('http://localhost:8085/auth/checkJwtToken',
            {},
            {
                withCredentials: true
            });
            setLoadingStatus(false);
        }
        // The use needs to login again. Going back to the home page
        catch(error) {
            console.log(error);
            router.replace('/');
        }
    });

    useEffect(() => {
        verifyJwtToken();
    },[]);

    return (
        loadingStatus ?
        <></> :
        <Dashboard />
    );
}