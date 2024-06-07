"use client";
import axios from 'axios';
import { useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  const loginToUpstox = async () => {

    const response = await axios.get('http://localhost:8085/auth/getLoginUrl',
    {
        withCredentials: true
    });
    const loginUrl = response.data.loginUrl;

    router.replace(loginUrl);
  }

  // To verify whether the user has access
  const verifyJwtToken = (async () => {
    try {
        const response = await axios.post('http://localhost:8085/auth/checkJwtToken',
        {},
        {
            withCredentials: true
        });
        // If the user is already logged in
        router.replace('/dashboard');
    }
    // The use needs to login
    catch(error) {
      loginToUpstox();
    }
  });

  useEffect(() => {
    verifyJwtToken();
  }, []);

  return (
    <></>
  );
}
