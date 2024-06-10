import mongoose from "mongoose";

let userSchema = {
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

let userModel = mongoose.model('Users', userSchema, 'Users');

export default userModel;