const firebaseAdmin = require("firebase-admin");
const firebaseClient = require("firebase/app");

const adminAccount = require("./" + process.env.FIREBASE_ADMIN_CONFIG);
const clientAccount = require("./" + process.env.FIREBASE_CLIENT_CONFIG);

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(adminAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

firebaseClient.initializeApp(clientAccount);

module.exports = {
    firebaseAdmin,
    firebaseClient,
};