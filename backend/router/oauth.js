import express from "express";
import { login, register, logout } from "../controller/oauthController.js";
import {
  googleAuthStatus,
  googleCallback,
  startGoogleAuth,
} from "../controller/googleAuthController.js";
import { authRateLimiter } from "../config/security.js";

const router = express.Router();

router.use(authRateLimiter);

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);

router.get("/google/status", googleAuthStatus);
router.get("/google", startGoogleAuth);
router.get("/google/callback", googleCallback);

export default router;
