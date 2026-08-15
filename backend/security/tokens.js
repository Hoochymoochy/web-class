import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AUTH_COOKIE_NAME, cookieOptions } from "../config/security.js";

export function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      authProvider: user.authProvider,
    },
    env.jwtSecret,
    { expiresIn: "1h" }
  );
}

export function setAuthCookie(res, token) {
  res.cookie(AUTH_COOKIE_NAME, token, cookieOptions);
}

export function clearAuthCookie(res) {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? "strict" : "lax",
    path: "/",
  });
}

export function getTokenFromRequest(req) {
  const headerToken = req.headers.authorization?.split(" ")[1];
  if (headerToken) {
    return headerToken;
  }

  return req.cookies?.[AUTH_COOKIE_NAME] ?? null;
}

export function buildAuthResponse(user, token) {
  return {
    token,
    id: user.id,
    email: user.email,
    name: user.name,
    authProvider: user.authProvider,
  };
}
