import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { upsertGoogleUser } from './prismaController.js';

const getOAuthClient = () => {
  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );
};

const issueSessionToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const googleAuth = (req, res) => {
  const oauth2Client = getOAuthClient();
  const nonce = crypto.randomBytes(16).toString('hex');
  const state = jwt.sign({ nonce }, process.env.JWT_SECRET, { expiresIn: '10m' });

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'email', 'profile'],
    state,
    prompt: 'select_account',
  });

  res.redirect(authUrl);
};

const googleCallback = async (req, res) => {
  const { code, state, error } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  if (error) {
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(String(error))}`);
  }

  if (!code || !state) {
    return res.status(400).json({ error: 'Missing authorization code or state' });
  }

  try {
    jwt.verify(String(state), process.env.JWT_SECRET);
  } catch {
    return res.status(403).json({ error: 'Invalid or expired OAuth state' });
  }

  try {
    const oauth2Client = getOAuthClient();
    const { tokens } = await oauth2Client.getToken(String(code));
    oauth2Client.setCredentials(tokens);

    if (!tokens.id_token) {
      return res.status(401).json({ error: 'Google did not return an ID token' });
    }

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      return res.status(401).json({ error: 'Invalid Google profile' });
    }

    const user = await upsertGoogleUser({
      googleId: payload.sub,
      email: payload.email,
      name: payload.name || payload.email.split('@')[0],
      avatar: payload.picture || null,
    });

    const token = issueSessionToken(user);
    const params = new URLSearchParams({
      token,
      id: user.id,
      email: user.email,
      name: user.name,
    });

    res.redirect(`${frontendUrl}/auth/callback?${params.toString()}`);
  } catch (err) {
    console.error('Google OAuth callback error:', err);
    res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
  }
};

const verifyGoogleToken = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ error: 'Google credential is required' });
  }

  try {
    const oauth2Client = getOAuthClient();
    const ticket = await oauth2Client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      return res.status(401).json({ error: 'Invalid Google credential' });
    }

    const user = await upsertGoogleUser({
      googleId: payload.sub,
      email: payload.email,
      name: payload.name || payload.email.split('@')[0],
      avatar: payload.picture || null,
    });

    const token = issueSessionToken(user);
    res.status(200).json({ token, id: user.id, email: user.email, name: user.name });
  } catch (err) {
    console.error('Google token verification error:', err);
    res.status(401).json({ error: 'Invalid Google credential' });
  }
};

export { googleAuth, googleCallback, verifyGoogleToken };
