const { firebaseAdmin } = require("../Model/firebaseConfig");

async function decodeToken(req) {
    let token = null;
    try {
        //Get JWT token part from header by removing "Bearer "
        token = req.headers.authorization.split(" ")[1];
    } catch (error) {
        throw error;
    }

    let result = null;
    await firebaseAdmin
        .auth()
        .verifyIdToken(token)
        .then((decodedToken) => {
            result = decodedToken;
        })
        .catch((error) => {
            throw error;
        });
    return result;
}

module.exports = {
    decodeToken,
};
