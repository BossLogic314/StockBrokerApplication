import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = 'd27c9cfed705aef71c5a56264f9d96fbe4c4ac6b8741e1525e086b568801fe3ba23361b2048f103dfdd59e7a8ce40a2cca16317a347ba7ddce1dd1e3fd6885b2';

export let generateJwtTokenAndPutInCookie = (jsonObj, res) => {
    try {
        const jwtToken = jwt.sign(jsonObj, ACCESS_TOKEN_SECRET);
        res.cookie("jwt", jwtToken, {httpOnly: true});
    }
    catch(error) {
        throw(error);
    }
}

// Returns the access token from the cookie
export let verifyJwtToken = (jwtToken) => {
    try {
        const result = jwt.verify(jwtToken, ACCESS_TOKEN_SECRET);
        return result.accessToken;
    }
    catch(error) {
        return null;
    }
};