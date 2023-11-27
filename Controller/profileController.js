const { firebaseAdmin } = require("../Model/firebaseConfig");
const firebaseClient = require("firebase/auth");
const { get, use } = require("../Routes/routes");
const { decodeToken } = require("./utils");

const getProfile = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    decodeToken(token)
        .then((decodedToken) => {
            const uid = decodedToken.uid;
            firebaseAdmin
                .auth()
                .getUser(uid)
                .then((userRecord) => {
                    res.status(200).json({
                        status: "success",
                        data: {
                            email: userRecord.email,
                            displayName: userRecord.displayName || null,
                            photoURL: userRecord.photoURL || null,
                        },
                    });
                })
                .catch((error) => {
                    res.status(400).json({ status: "error", error: error });
                });
        })
        .catch((error) => {
            res.status(400).json({ status: "error", error: error });
        });
};

const updateProfile = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    decodeToken(token)
        .then((decodedToken) => {
            const { displayName, photoURL } = req.body;

            firebaseAdmin
                .auth()
                .updateUser(decodedToken.uid, {
                    displayName: displayName,
                    photoURL: photoURL,
                })
                .then(() => {
                    res.status(200).json({
                        status: "success",
                        message: "Profile updated successfully",
                    });
                })
                .catch((error) => {
                    res.status(400).json({ status: "error", error: error });
                });
        })
        .catch((error) => {
            res.status(400).json({ status: "error", error: error });
        });
};

module.exports = {
    getProfile,
    updateProfile,
};
