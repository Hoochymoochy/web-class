import { OAuth2Client } from "google-auth-library";
import {
  createGoogleUser,
  findUserByGoogleId,
  getUser,
  linkGoogleAccount,
} from "./prismaController.js";
import { env, isGoogleAuthConfigured } from "../config/env.js";
import { createOAuthState, consumeOAuthState } from "../security/oauthState.js";
import {
  buildAuthResponse,
  setAuthCookie,
  signAccessToken,
} from "../security/tokens.js";
import { canLinkGoogleAccount } from "../security/authPolicy.js";

const googleScopes = ["openid", "email", "profile"];

function getOAuthClient() {
  return new OAuth2Client(
    env.googleClientId,
    env.googleClientSecret,
    env.googleCallbackUrl
  );
}

const startGoogleAuth = (req, res) => {
  if (!isGoogleAuthConfigured()) {
    return res.status(503).json({ error: "Google sign-in is not configured." });
  }

  const client = getOAuthClient();
  const state = createOAuthState();
  const authUrl = client.generateAuthUrl({
    access_type: "online",
    scope: googleScopes,
    state,
    prompt: "select_account",
  });

  res.redirect(authUrl);
};

const googleCallback = async (req, res) => {
  if (!isGoogleAuthConfigured()) {
    return res.redirect(`${env.frontendUrl}/login?error=google_not_configured`);
  }

  const { code, state, error } = req.query;

  if (error) {
    return res.redirect(`${env.frontendUrl}/login?error=google_denied`);
  }

  if (!code || !state || !consumeOAuthState(String(state))) {
    return res.redirect(`${env.frontendUrl}/login?error=invalid_oauth_state`);
  }

  try {
    const client = getOAuthClient();
    const { tokens } = await client.getToken(String(code));
    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: env.googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload.sub) {
      return res.redirect(`${env.frontendUrl}/login?error=google_profile_missing`);
    }

    const googleId = payload.sub;
    const email = payload.email.toLowerCase();
    const name = payload.name ?? email.split("@")[0];

    let user = await findUserByGoogleId(googleId);

    if (!user) {
      const existingByEmail = await getUser(email);
      const linkDecision = canLinkGoogleAccount(existingByEmail);

      if (!linkDecision.allowed) {
        return res.redirect(`${env.frontendUrl}/login?error=account_link_failed`);
      }

      if (linkDecision.action === "create") {
        user = await createGoogleUser({ email, name, googleId });
      } else if (linkDecision.action === "link") {
        user = await linkGoogleAccount(existingByEmail.id, googleId);
      } else {
        user = existingByEmail;
      }
    }

    const token = signAccessToken(user);
    setAuthCookie(res, token);

    const params = new URLSearchParams({
      auth: "google",
      id: user.id,
    });
    res.redirect(`${env.frontendUrl}/?${params.toString()}`);
  } catch (err) {
    console.error("Google OAuth callback failed:", err.message);
    res.redirect(`${env.frontendUrl}/login?error=google_auth_failed`);
  }
};

const googleAuthStatus = (_req, res) => {
  res.json({ enabled: isGoogleAuthConfigured() });
};

export { startGoogleAuth, googleCallback, googleAuthStatus };
