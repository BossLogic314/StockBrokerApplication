import axios from "axios";

export const signOut = async (event) => {
    try {
        const response = await axios.post('http://localhost:8085/auth/logout', {},
        {
            withCredentials: true
        });
        window.location.reload();
        router.replace('/');
    }
    // The user has to login again
    catch(error) {
        router.replace('/');
    }
}