import { getUser, addUser } from "./prismaController.js";
import bcrypt from "bcrypt";
import {
  buildAuthResponse,
  clearAuthCookie,
  setAuthCookie,
  signAccessToken,
} from "../security/tokens.js";
import {
  canUsePasswordLogin,
  validateLocalRegistration,
} from "../security/authPolicy.js";

const register = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Email, password, and name are required." });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await getUser(normalizedEmail);
  const registrationCheck = validateLocalRegistration(existingUser);

  if (!registrationCheck.allowed) {
    return res.status(registrationCheck.status).json({ error: registrationCheck.error });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await addUser(normalizedEmail, hashedPassword, name, "LOCAL");
    const token = signAccessToken(user);
    setAuthCookie(res, token);
    res.status(201).json(buildAuthResponse(user, token));
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "An account with this email already exists." });
    }
    console.error("Registration failed:", err.message);
    res.status(500).json({ error: "Registration failed." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await getUser(normalizedEmail);
  const loginCheck = canUsePasswordLogin(user);

  if (!loginCheck.allowed) {
    return res.status(loginCheck.error.includes("Google") ? 403 : 401).json({
      error: loginCheck.error,
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = signAccessToken(user);
  setAuthCookie(res, token);
  res.status(200).json(buildAuthResponse(user, token));
};

const logout = (_req, res) => {
  clearAuthCookie(res);
  res.status(200).json({ message: "Logged out." });
};

export { register, login, logout };
