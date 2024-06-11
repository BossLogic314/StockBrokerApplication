import { verifyJwtToken } from '../utils/jwtToken.js';
import userModel from '../models/User.js';

export const getWatchLists = (async (req, res) => {

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
    const userId = req.query.userId;
    const user = await userModel.findOne({userId: userId}).lean();
    res.status(200).json({watchLists: user.watchLists});
  }
  catch(error) {
    res.status(500).json({message: error.message});
  }
});

export const addStockToWatchList = (async (req, res) => {

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
    const userId = req.body.userId;
    const watchListIndex = req.body.watchListIndex;
    const instrumentKey = req.body.instrumentKey;
    const name = req.body.name;
    const instrumentType = req.body.instrumentType;
    const exchange = req.body.exchange;

    const user = await userModel.findOne({userId: userId});
    user.watchLists[watchListIndex].stocks.push(
      {
        instrumentKey: instrumentKey,
        name: name,
        instrument_type: instrumentType,
        exchange: exchange
      }
    );
    await user.save();

    res.status(200).json({message: "Stock successfully added to watchlist"});
  }
  catch(error) {
    res.status(500).json({message: error.message});
  }
});

export const deleteStockFromWatchList = (async (req, res) => {

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
    const userId = req.body.userId;
    const watchListIndex = req.body.watchListIndex;
    const instrumentKey = req.body.instrumentKey;

    const user = await userModel.findOne({userId: userId});
    const stocks = user.watchLists[watchListIndex].stocks;
    const newStocks = [];
    for (let i = 0; i < stocks.length; ++i) {

      // Stock to delete
      if (stocks[i].instrumentKey == instrumentKey) {
        continue;
      }

      newStocks.push(stocks[i]);
    }
    // Updating the stocks in the watchlist
    user.watchLists[watchListIndex].stocks = newStocks;

    await user.save();

    res.status(200).json({message: "Stock successfully deleted from watchlist"});
  }
  catch(error) {
    res.status(500).json({message: error.message});
  }
});

export const addWatchList = (async (req, res) => {

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
    const userId = req.body.userId;

    const user = await userModel.findOne({userId: userId});
    user.watchLists.push({name: "Watchlist", stocks: []});
    await user.save();

    res.status(200).json({message: "Successfully added watchlist!"});
  }
  catch(error) {
    res.status(500).json({message: error.message});
  }
});

export const deleteWatchList = (async (req, res) => {

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
    const userId = req.body.userId;
    const watchListIndex = req.body.watchListIndex;

    const user = await userModel.findOne({userId: userId});
    // Removing the watchlist
    const newWatchLists = user.watchLists.filter((element, index) => index != watchListIndex);
    user.watchLists = newWatchLists;
    await user.save();

    res.status(200).json({message: "Successfully added watchlist!"});
  }
  catch(error) {
    res.status(500).json({message: error.message});
  }
});

export const changeWatchListName = (async (req, res) => {

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
    const userId = req.body.userId;
    const newWatchListName = req.body.newWatchListName;
    const watchListIndex = req.body.watchListIndex;

    const user = await userModel.findOne({userId: userId});

    // Changing the watchlist's name
    user.watchLists[watchListIndex].name = newWatchListName;
    await user.save();

    res.status(200).json({message: "Successfully change the watchlist's name!"});
  }
  catch(error) {
    res.status(500).json({message: error.message});
  }
});