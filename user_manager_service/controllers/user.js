import axios from 'axios';
import { verifyJwtToken } from '../utils/jwtToken.js';

export const getUserInformation = (async (req, res) => {

    let accessToken = null;
    try {
      const jwtToken = req.cookies.jwt;
      accessToken = verifyJwtToken(jwtToken);
  
      if (!accessToken) {
        res.status(401).json({message: "User unauthorized!"});
        return;
      }
    }
    catch(error) {
      res.status(401).json({message: "User unauthorized!"});
      return;
    }

    const url = 'https://api.upstox.com/v2/user/profile';
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };

    axios.get(url, { headers })
      .then(response => {
        res.status(200).json({response: response.data});
      })
      .catch(error => {
        res.status(500).json({message: "Server error!"});
      });
});

export const getAccessToken = (async (req, res) => {
  let accessToken = null;
  try {
    const jwtToken = req.cookies.jwt;
    accessToken = verifyJwtToken(jwtToken);

    if (!accessToken) {
      res.status(401).json({message: "User unauthorized!"});
      return;
    }
  }
  catch(error) {
    res.status(401).json({message: "User unauthorized!"});
    return;
  }

  res.status(200).json({accessToken: accessToken});
});