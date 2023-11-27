const { firebaseAdmin } = require("../Model/firebaseConfig");

async function decodeToken(token) {
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
