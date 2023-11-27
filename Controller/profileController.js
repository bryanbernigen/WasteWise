const { firebaseAdmin } = require("../Model/firebaseConfig");
const firebaseClientStorage = require("firebase/storage");
const { get, use } = require("../Routes/routes");
const { decodeToken } = require("./utils");
const sharp = require("sharp");
const fs = require("fs");

const getProfile = async (req, res) => {    
    decodeToken(req)
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
    decodeToken(req)
        .then((decodedToken) => {
            const { displayName} = req.body;

            firebaseAdmin
                .auth()
                .updateUser(decodedToken.uid, {
                    displayName: displayName,
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

const uploadProfilePicture = async (req, res) => {
    decodeToken(req)
        .then(async (decodedToken) => {
            //Handle the file upload
            //Get The Uploaded File
            const file = req.files;

            //If no file is uploaded, return error
            if (!file) {
                res.status(400).json({
                    status: "error",
                    error: "No file uploaded",
                });
                return;
            }

            //If the file is not an image, return error
            if (
                file.profilePicture.mimetype !== "image/jpeg" &&
                file.profilePicture.mimetype !== "image/png"
            ) {
                res.status(400).json({
                    status: "error",
                    error: "Invalid file type, Please upload JPEG or PNG",
                });
                return;
            }

            //If the file size is greater than 1MB, resize it
            let buffer = file.profilePicture.data;
            let metadata = await sharp(buffer).metadata();
            if (metadata.width > 400 || metadata.height > 400) {
                //Resize the bigger dimension to 1024px
                if (metadata.width > metadata.height) {
                    //Landscape Image
                    buffer = await sharp(buffer)
                        .resize({ width: 400 })
                        .toBuffer();
                } else {
                    //Portrait Image
                    buffer = await sharp(buffer)
                        .resize({ height: 400 })
                        .toBuffer();
                }
            }

            // // LOCAL TESTING
            // // Save the file to local storage for testing
            // const fileName = "profilePicture-" + Date.now() + ".jpg";
            // fs.writeFile(fileName, buffer, "binary", (err) => {
            //     if (!err) console.log(`${fileName} created successfully!`);
            // });

            // PRODUCTION
            // Upload the file to firebase storage
            const storage = firebaseAdmin.storage().bucket();
            const fileName =
                "users/"+decodedToken.email+"/profilePicture.jpg";
            storage.file(fileName).save(buffer, {
                metadata: {
                    contentType: "image/jpeg",
                },
            }).then(() => {
                //Update the user's profile picture
                let emailRef = decodedToken.email.replace("@", "%40");
                firebaseAdmin.auth().updateUser(decodedToken.uid, {
                    photoURL: "https://storage.cloud.google.com/"+process.env.FIREBASE_STORAGE_BUCKET+"/users/"+emailRef+"/profilePicture.jpg",
                });
            });

            //Return success message
            res.status(200).json({
                status: "success",
                message: "Profile picture uploaded successfully",
            });
        })
        .catch((error) => {
            res.status(400).json({ status: "error", error: error });
        });
};

module.exports = {
    getProfile,
    updateProfile,
    uploadProfilePicture,
};
