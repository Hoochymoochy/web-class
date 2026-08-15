import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { getTokenFromRequest } from "../security/tokens.js";

export function authenticateToken(req, res, next) {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(403).json({ error: "Token required" });
  }

  jwt.verify(token, env.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    req.user = user;
    next();
  });
}
