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

export const getOrderBook = (async (req, res) => {

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

  const url = 'https://api.upstox.com/v2/order/retrieve-all';
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  };
  
  axios.get(url, { headers })
    .then(response => {
      res.status(200).json({orders: response.data});
    })
    .catch(error => {
      res.status(500).json({message: "Server error!"});
    });
});

export const getHoldings = (async (req, res) => {

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

  const url = 'https://api.upstox.com/v2/portfolio/long-term-holdings';
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  };
  
  axios.get(url, { headers })
    .then(response => {
      res.status(200).json({holdings: response.data});
    })
    .catch(error => {
      res.status(500).json({message: "Server error!"});
    });
});

export const getFundsAndMargin = (async (req, res) => {

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

  const url = 'https://api.upstox.com/v2/user/get-funds-and-margin';
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  };
  
  axios.get(url, { headers })
    .then(response => {
      res.status(200).json({fundsAndMargin: response.data});
    })
    .catch(error => {
      res.status(500).json({message: "Server error!"});
    });
});

export const placeOrder = (async (req, res) => {

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

  const url = 'https://api.upstox.com/v2/order/place';
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  };
  
  const data = {
    quantity: 1,
    product: 'D',
    validity: 'DAY',
    price: 10,
    tag: 'string',
    instrument_token: 'BSE_EQ|INE0CT101020',
    //instrument_token: 'NSE_EQ|INE669E01016',
    order_type: 'LIMIT',
    transaction_type: 'SELL',
    disclosed_quantity: 0,
    trigger_price: 0,
    is_amo: false,
  };
  
  axios.post(url, data, { headers })
    .then(response => {
      console.log('Response:', response.data);
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
});