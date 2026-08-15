const DEFAULT_BACKEND_URL = "http://localhost:3001";
const DEFAULT_FRONTEND_URL = "http://localhost:5173";
const GOOGLE_CALLBACK_PATH = "/api/oauth/google/callback";

const GOOGLE_SCOPES = ["openid", "email", "profile"];

function env(name, fallback) {
  return process.env[name] ?? fallback;
}

/** @returns {import('./googleOAuth.types.js').GoogleOAuthConfig} */
export function getGoogleOAuthConfig() {
  const backendUrl = env("BACKEND_URL", DEFAULT_BACKEND_URL).replace(/\/$/, "");
  const frontendUrl = env("FRONTEND_URL", DEFAULT_FRONTEND_URL).replace(/\/$/, "");
  const redirectUri =
    env("GOOGLE_REDIRECT_URI", null) ?? `${backendUrl}${GOOGLE_CALLBACK_PATH}`;

  return {
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    redirectUri,
    backendUrl,
    frontendUrl,
    callbackPath: GOOGLE_CALLBACK_PATH,
    startPath: "/api/oauth/google",
    scopes: GOOGLE_SCOPES,
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    userInfoEndpoint: "https://www.googleapis.com/oauth2/v3/userinfo",
  };
}

/** @returns {import('./googleOAuth.types.js').GoogleOAuthConfig} */
export function requireGoogleOAuthConfig() {
  const config = getGoogleOAuthConfig();
  const missing = [];

  if (!config.clientId) missing.push("GOOGLE_CLIENT_ID");
  if (!config.clientSecret) missing.push("GOOGLE_CLIENT_SECRET");

  if (missing.length > 0) {
    throw new Error(
      `Google OAuth is not configured. Set: ${missing.join(", ")}. See docs/identity/google-oauth-setup.md`,
    );
  }

  return config;
}

export function buildGoogleAuthUrl(state) {
  const config = requireGoogleOAuthConfig();
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: config.scopes.join(" "),
    access_type: "offline",
    prompt: "consent",
    state,
  });

  return `${config.authorizationEndpoint}?${params.toString()}`;
}
