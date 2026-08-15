import crypto from "crypto";

const STATE_TTL_MS = 10 * 60 * 1000;
const pendingStates = new Map();

function purgeExpiredStates() {
  const now = Date.now();
  for (const [state, entry] of pendingStates.entries()) {
    if (entry.expiresAt <= now) {
      pendingStates.delete(state);
    }
  }
}

export function createOAuthState() {
  purgeExpiredStates();
  const state = crypto.randomBytes(32).toString("base64url");
  pendingStates.set(state, { expiresAt: Date.now() + STATE_TTL_MS });
  return state;
}

export function consumeOAuthState(state) {
  if (!state || typeof state !== "string") {
    return false;
  }

  purgeExpiredStates();
  const entry = pendingStates.get(state);
  if (!entry) {
    return false;
  }

  pendingStates.delete(state);
  return entry.expiresAt > Date.now();
}
