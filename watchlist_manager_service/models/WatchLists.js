import mongoose from "mongoose";

let watchListsSchema = {
    userId: String,
    watchLists: [
        {
            stocks: [
                {
                    instrumentKey: String,
                    name: String,
                    instrumentType: String,
                    exchange: String
                }
            ]
        }
    ]
}

let watchListsModel = mongoose.model('WatchLists', watchListsSchema, 'WatchLists');

export default watchListsModel;