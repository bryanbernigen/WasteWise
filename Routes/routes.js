const express = require("express");
const authController = require("../Controller/authController");
const profileController = require("../Controller/profileController");

const router = express.Router();

//Auth Routes
router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.post("/auth/forgotPassword", authController.forgotPassword);
router.post("/auth/refreshToken", authController.refreshToken)

//Profile Routes
router.get("/profile", profileController.getProfile);
router.post("/profile/update", profileController.updateProfile);
router.post("/profile/uploadProfilePicture", profileController.uploadProfilePicture);

module.exports = router;
