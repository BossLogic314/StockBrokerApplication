import axios from 'axios';
import { verifyJwtToken } from '../utils/jwtToken.js';
import watchListsModel from '../models/WatchLists.js';

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
    const watchLists = await watchListsModel.findOne({userId: userId});

    res.status(200).json({watchLists: watchLists});
  }
  catch(error) {
    res.status(500).json({message: error.message});
  }
});