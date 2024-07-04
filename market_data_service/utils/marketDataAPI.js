// Import required modules
import { ApiClient, WebsocketApi } from "upstox-js-sdk";
import { WebSocket } from "ws";
import pkg from "protobufjs";
const {load} = pkg;

// Initialize global variables
let protobufRoot = null;
let defaultClient = ApiClient.instance;
let apiVersion = "2.0";
let OAUTH2 = defaultClient.authentications["OAUTH2"];

// Function to authorize the market data feed
const getMarketFeedUrl = async () => {
  return new Promise((resolve, reject) => {
    let apiInstance = new WebsocketApi(); // Create new Websocket API instance

    // Call the getMarketDataFeedAuthorize function from the API
    apiInstance.getMarketDataFeedAuthorize(
      apiVersion,
      (error, data, response) => {
        if (error) reject(error); // If there's an error, reject the promise
        else resolve(data.data.authorizedRedirectUri); // Else, resolve the promise with the authorized URL
      }
    );
  });
};

// Function to establish WebSocket connection
const connectWebSocket = async (wsUrl, instrumentKeys, callback) => {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl, {
      headers: {
        "Api-Version": apiVersion,
        Authorization: "Bearer " + OAUTH2.accessToken,
      },
      followRedirects: true,
    });

    // WebSocket event handlers
    ws.on("open", () => {
      console.log("connected");
      resolve(ws); // Resolve the promise once connected

      // Set a timeout to send a subscription message after 1 second
      setTimeout(() => {
        const data = {
          guid: "someguid",
          method: "sub",
          data: {
            mode: "full",
            instrumentKeys: instrumentKeys,
          },
        };
        ws.send(Buffer.from(JSON.stringify(data)));
      }, 1000);
    });

    ws.on("close", () => {
      console.log("disconnected");
    });

    ws.on("message", (data) => {
      const decodedData = decodeProfobuf(data);
      const information = Object.keys(decodedData.feeds).map(
        (key) => ({
          instrumentKey: key,
          ltp: decodedData.feeds[key]?.ff?.indexFF?.ltpc?.ltp,
          open1D: decodedData.feeds[key]?.ff?.indexFF?.marketOHLC?.ohlc[0].open,
          close1D: decodedData.feeds[key]?.ff?.indexFF?.marketOHLC?.ohlc[0].close
        })
      );
      callback(JSON.stringify(information));
    });

    ws.on("error", (error) => {
      console.log("error:", error);
      reject(error); // Reject the promise on error
    });
  });
};

// Function to initialize the protobuf part
const initProtobuf = async () => {
  protobufRoot = await load("./utils/MarketDataFeed.proto");
  console.log("Protobuf part initialization complete");
};

// Function to decode protobuf message
const decodeProfobuf = (buffer) => {
  if (!protobufRoot) {
    console.warn("Protobuf part not initialized yet!");
    return null;
  }

  const FeedResponse = protobufRoot.lookupType(
    "com.upstox.marketdatafeeder.rpc.proto.FeedResponse"
  );
  return FeedResponse.decode(buffer);
};

let keyToSocketMap = {};

// Initialize the protobuf part and establish the WebSocket connection
export const getMarketDataFeed = (async (accessToken, key, instrumentKeys, callback) => {
  OAUTH2.accessToken = accessToken;
  try {
    if (keyToSocketMap[key] != undefined) {
      await keyToSocketMap[key].close();
    }
    await initProtobuf(); // Initialize protobuf
    const wsUrl = await getMarketFeedUrl(); // Get the market feed URL
    keyToSocketMap[key] = await connectWebSocket(wsUrl, instrumentKeys, callback); // Connect to the WebSocket
  }
  catch (error) {
    console.error("An error occurred:", error);
  }
});