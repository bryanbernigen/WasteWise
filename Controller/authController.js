const env = require("dotenv").config();
const { firebaseAdmin } = require("../Model/firebaseConfig");
const firebaseClient = require("firebase/auth");
const { decodeToken } = require("./utils");
const axios = require("axios");

const login = async (req, res) => {
    const { email, password } = req.body;

    const auth = firebaseClient.getAuth();
    //Login with email and password
    firebaseClient
        .signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            //Send token to client
            if (userCredential.user.emailVerified) {
                userCredential.user.getIdToken().then((token) => {
                    res.status(200).json({
                        status: "success",
                        token: token,
                        refreshToken: userCredential.user.refreshToken,
                    });
                });
            } else {
                firebaseClient.signOut(auth);
                res.status(401).json({
                    status: "error",
                    error: {
                        message: "email not verified",
                    },
                });
            }
        })
        .catch((error) => {
            res.status(400).json({ status: "error", error: error });
        });
};

const register = async (req, res) => {
    const { email, password } = req.body;

    //Create User
    firebaseAdmin
        .auth()
        .createUser({
            email: email,
            emailVerified: false,
            password: password,
            disabled: false,
        })
        //If user is created successfully
        .then((userRecord) => {
            //Create custom token for server to login
            //This is used to send email verification
            firebaseAdmin
                .auth()
                .createCustomToken(userRecord.uid)
                .then((customToken) => {
                    //Login with custom token to send email verification
                    const auth = firebaseClient.getAuth();
                    firebaseClient
                        .signInWithCustomToken(auth, customToken)
                        .then(() => {
                            firebaseClient
                                .sendEmailVerification(auth.currentUser)
                                .then(() => {
                                    //Logout after sending email verification
                                    firebaseClient.signOut(auth);
                                    res.status(200).json({
                                        status: "success",
                                        message: "email verification sent",
                                    });
                                });
                        });
                })
                .catch(() => {
                    res.status(200).json({
                        status: "success",
                        message: "email verification not sent",
                    });
                });
        })
        .catch((error) => {
            res.status(500).json({ status: "error", error: error });
        });
};

const refreshToken = async (req, res) => {
    axios
        .post(
            "https://securetoken.googleapis.com/v1/token?key=" +
                process.env.FIREBASE_API_KEY,
            {
                grant_type: "refresh_token",
                refresh_token: req.body.refreshToken,
            }
        )
        .then((response) => {
            res.status(200).json({
                status: "success",
                token: response.data.id_token,
                refreshToken: response.data.refresh_token,
            });
        })
        .catch((error) => {
            res.status(400).json({ status: "error", error: error.response.data.error });
        });
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    const auth = firebaseClient.getAuth();
    firebaseClient.sendPasswordResetEmail(auth, email).then(() => {
        res.status(200).json({
            status: "success",
            message: "password reset link sent to email",
        });
    });
};

module.exports = {
    login,
    register,
    refreshToken,
    forgotPassword,
};
