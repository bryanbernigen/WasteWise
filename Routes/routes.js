const express = require("express");
const authController = require("../Controller/authController");
const articleController = require("../Controller/articleController");
const profileController = require("../Controller/profileController");
const wasteController = require("../Controller/wasteController");

const router = express.Router();

//Auth Routes
router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.post("/auth/forgotPassword", authController.forgotPassword);
router.post("/auth/refreshToken", authController.refreshToken)

//Article Routes
router.get("/article/count", articleController.getArticlesCount);
router.get("/article/page/:pagenumber", articleController.getArticles);
router.get("/article/details/:content_id", articleController.getArticleDetails);

//Profile Routes
router.get("/profile", profileController.getProfile);
router.post("/profile/update", profileController.updateProfile);
router.post("/profile/uploadProfilePicture", profileController.uploadProfilePicture);

//Waste Routes
router.get("/waste/all", wasteController.getAllWastes);
router.get("/waste/details/:waste_id", wasteController.getWasteDetails);

module.exports = router;
