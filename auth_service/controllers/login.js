import axios from 'axios';
import { generateJwtTokenAndPutInCookie } from '../utils/jwtToken.js'

const url = 'https://api.upstox.com/v2/login/authorization/token';
const headers = {
    'accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
};

// Returns the login url with which the user can login to upstox
export let getLoginUrl = (async (req, res) => {
    const redirectUri = 'http%3A%2F%2Flocalhost%3A3000%2Flogin';
    const loginUrl = `https://api.upstox.com/v2/login/authorization/dialog?client_id=${process.env.UPSTOX_API_KEY}&redirect_uri=${redirectUri}&response_type=code`;
    res.status(200).json({loginUrl: loginUrl});
});

// Returns a cookie with the secret access token with API calls can be made to Upstox
export let getAccessTokenInCookie = (async (req, res) => {

    const authCode = req.query.authCode;
    const data = {
        'code': authCode,
        'client_id': process.env.UPSTOX_API_KEY,
        'client_secret': process.env.UPSTOX_API_SECRET,
        'redirect_uri': 'http://localhost:3000/login',
        'grant_type': 'authorization_code',
    };

    axios.post(url, new URLSearchParams(data), { headers })
    .then(response => {
        const jsonObj = {
            "emailId": response.data.email,
            "accessToken": response.data.access_token
        }
        generateJwtTokenAndPutInCookie(jsonObj, res);
        res.status(200).json({message: "Generated ACCESS_TOKEN successfully!"});
    })
    .catch(error => {
        console.error(error.response.status);
        console.error(error.response.data);
        res.status(500).json({message: error.message});
    });
});