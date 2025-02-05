import axios from 'axios';
import fs from "fs";
import { parse } from "csv-parse";
import { verifyJwtToken } from '../utils/jwtToken.js';
import { openSearchClient } from '../opensearch/connect.js';
import UpstoxClient from "upstox-js-sdk";

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

  const instrumentKey = req.query.instrumentKey;

  const url = 'https://api.upstox.com/v2/market-quote/ohlc';
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  };

  const params = {
    instrument_key: instrumentKey,
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

export const getDataInInterval = (async (req, res) => {

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

  const milliSecondsInOneDay = 60 * 60 * 24 * 1000;
  const instrumentKey = req.query.instrumentKey;
  const interval = req.query.interval;
  const endDate = new Date();
  let startDate = null;

  if (interval == '1minute') {
    startDate = endDate.getTime() - 4 * milliSecondsInOneDay;
  }
  else if (interval == '30minute') {
    startDate = endDate.getTime() - 30 * milliSecondsInOneDay;
  }
  else if (interval == 'day') {
    startDate = endDate.getTime() - 365 * milliSecondsInOneDay;
  }
  else if (interval == 'week') {
    startDate = endDate.getTime() - 4 * 365 * milliSecondsInOneDay;
  }
  else {
    startDate = endDate.getTime() - 20 * 365 * milliSecondsInOneDay;
  }
  startDate = new Date(startDate);

  let apiVersion = "2.0";
  let toDate = `${endDate.getFullYear()}-${("0" + (endDate.getMonth() + 1)).slice(-2)}-${("0" + (endDate.getDate() + 1)).slice(-2)}`;
  let fromDate = `${startDate.getFullYear()}-${("0" + (startDate.getMonth() + 1)).slice(-2)}-${("0" + (startDate.getDate() + 1)).slice(-2)}`;

  let defaultClient = UpstoxClient.ApiClient.instance;
  var OAUTH2 = defaultClient.authentications["OAUTH2"];
  OAUTH2.accessToken = accessToken;
  let apiInstance = new UpstoxClient.HistoryApi();
  apiInstance.getHistoricalCandleData1(instrumentKey, interval, toDate, fromDate, apiVersion, (error, data, response) => {
    if (error) {
      res.status(500).json({"error": error});
    }
    else {
      const candles = data.data.candles;
      const response = candles.map((element) => ({
        time: Date.parse(element[0]) / 1000,
        open: element[1],
        high: element[2],
        low: element[3],
        close: element[4]
      }));
      res.status(200).json({candles: response.reverse()});
    }
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

export const loadData = (async (req, res) => {
  let i = 0;
  fs.createReadStream('complete.csv').pipe(parse({ delimiter: ',', quote: '"', columns: true })).on('data', async (row) => {

    if (row['exchange'] == 'NSE_EQ' || row['exchange'] == 'BSE_EQ') {
      try {
        // Creating document to upload to opensearch
        const document = {
          instrumentKey: row['instrument_key'],
          name: row['name'],
          type: row['instrument_type'],
          exchange: row['exchange']
        }

        const response = await openSearchClient.index({
          index: 'stocks',
          body: document,
          refresh: true
        });
        console.log(`Uploaded ${i} -> ${row['name']}`);
        i += 1;
      }
      catch(error) {
        console.log(`Error: ${error}`);
      }
    }
  });
  res.status(200).json({message: "Successfully uploaded!"});
});