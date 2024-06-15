import axios from 'axios';
import { verifyJwtToken } from '../utils/jwtToken.js';
import { openSearchClient } from '../opensearch/connect.js';
import { getMarketDataFeed } from '../utils/marketDataAPI.js';

export const getOHLCData = (async (req, res) => {

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

  //const symbol = req.query.symbol;

  const url = 'https://api.upstox.com/v2/market-quote/ohlc';
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  };

  const params = {
    instrument_key: 'NSE_EQ|INE669E01016',
    interval: '1d',
  };

  axios.get(url, { headers, params })
    .then(response => {
      res.status(200).json({OHLCData: response.data});
    })
    .catch(error => {
      res.status(500).json({message: "Server error!"});
    });
});

export const getScrips = (async (req, res) => {

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

  try {
    const searchString = req.query.searchString;
    const response = await openSearchClient.search({
      index: "stocks",
      body: {
        query: {
          match: {
            name: {
              query: searchString,
              fuzziness: "AUTO"
            }
          }
        }
      }
    });
    res.status(200).json({scrips: response});
  }
  catch(error) {
    res.status(500).json({message: "Server error!"});
  }
});