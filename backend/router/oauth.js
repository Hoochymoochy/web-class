import express from "express";
import { login, register } from "../controller/oauthController.js";
import { googleAuth, googleCallback, verifyGoogleToken } from "../controller/googleAuthController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);
router.post("/google/verify", verifyGoogleToken);

export default router;