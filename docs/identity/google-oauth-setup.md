# Google OAuth setup (web-class)

This guide configures Google Cloud OAuth for the web-class app. The backend uses an **authorization code flow** with JWT sessions (same pattern as local email/password auth).

## Architecture

| Component | URL (local) | Role |
|-----------|-------------|------|
| Frontend (Vite) | `http://localhost:5173` | Login UI, redirects user to backend OAuth start |
| Backend (Express) | `http://localhost:3001` | OAuth start + callback, token exchange, JWT issuance |

Planned OAuth routes (implemented by backend agent):

- `GET /api/oauth/google` — redirect user to Google consent screen
- `GET /api/oauth/google/callback` — Google redirect target; exchange code for tokens and issue app JWT

## 1. Google Cloud Console

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project (e.g. `web-class`).
3. Enable the **Google Identity** / **Google+ API** (or ensure **Google People API** is enabled for profile/email scopes).

## 2. OAuth consent screen

1. Go to **APIs & Services → OAuth consent screen**.
2. Choose **External** (or **Internal** if using Google Workspace only).
3. Fill in:
   - **App name:** web-class
   - **User support email:** your email
   - **Developer contact:** your email
4. **Scopes:** add at minimum:
   - `openid`
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
5. Add **test users** while the app is in **Testing** status (required for non-Workspace accounts during development).
6. Publish to **Production** when ready for public sign-in.

## 3. OAuth 2.0 Client ID (Web application)

1. Go to **APIs & Services → Credentials → Create credentials → OAuth client ID**.
2. Application type: **Web application**.
3. Name: e.g. `web-class-web`.

### Authorized JavaScript origins

| Environment | Origins |
|-------------|---------|
| Local | `http://localhost:5173`, `http://localhost:3001` |
| Production | `https://YOUR_FRONTEND_DOMAIN`, `https://YOUR_API_DOMAIN` |

### Authorized redirect URIs

These must match `GOOGLE_REDIRECT_URI` exactly (including trailing slash behavior).

| Environment | Redirect URI |
|-------------|--------------|
| Local | `http://localhost:3001/api/oauth/google/callback` |
| Production | `https://YOUR_API_DOMAIN/api/oauth/google/callback` |

4. Save and copy the **Client ID** and **Client secret**.

> Use one Web client for both local and production by registering all origins and redirect URIs above. Alternatively, create separate clients per environment.

## 4. Environment variables

### Backend (`backend/.env`)

Copy from `backend/.env.example`:

```bash
cp backend/.env.example backend/.env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret for signing app JWTs (local + Google sessions) |
| `BACKEND_URL` | Yes (prod) | Public API base URL; default local: `http://localhost:3001` |
| `FRONTEND_URL` | Yes (prod) | Frontend base URL for post-login redirect; default local: `http://localhost:5173` |
| `GOOGLE_CLIENT_ID` | Yes (Google auth) | From Google Cloud OAuth client |
| `GOOGLE_CLIENT_SECRET` | Yes (Google auth) | From Google Cloud OAuth client (server only) |
| `GOOGLE_REDIRECT_URI` | Optional | Defaults to `{BACKEND_URL}/api/oauth/google/callback` |

**Local example:**

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/webclass
JWT_SECRET=change-me-to-a-long-random-string
BACKEND_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxx
GOOGLE_REDIRECT_URI=http://localhost:3001/api/oauth/google/callback
```

**Production example:**

```env
DATABASE_URL=postgresql://...
JWT_SECRET=<strong-production-secret>
BACKEND_URL=https://api.example.com
FRONTEND_URL=https://app.example.com
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxx
GOOGLE_REDIRECT_URI=https://api.example.com/api/oauth/google/callback
```

### Frontend (`my-react-app/.env`)

Copy from `my-react-app/.env.example`:

```bash
cp my-react-app/.env.example my-react-app/.env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_BACKEND_URL` | Yes | Backend API base URL |
| `VITE_GOOGLE_CLIENT_ID` | Yes (Google button) | Same Client ID as backend (safe to expose in browser) |

**Local:**

```env
VITE_BACKEND_URL=http://localhost:3001
VITE_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
```

**Production:**

```env
VITE_BACKEND_URL=https://api.example.com
VITE_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
```

## 5. Secrets handling

- Never commit `.env` files (already in `.gitignore`).
- Store production secrets in your host's secret manager (e.g. Railway, Render, Fly.io env, GCP Secret Manager).
- `GOOGLE_CLIENT_SECRET` and `JWT_SECRET` must **only** exist on the backend.
- `VITE_GOOGLE_CLIENT_ID` is public; do not put the client secret in frontend env vars.

## 6. Verify configuration

1. Start backend with `backend/.env` loaded (see `backend/main.js`).
2. Confirm redirect URI in Google Console matches `GOOGLE_REDIRECT_URI`.
3. Hit `GET {BACKEND_URL}/api/oauth/google` once routes exist — you should reach Google's consent screen.
4. After approving, Google redirects to `/api/oauth/google/callback` with `?code=...`.

Shared OAuth config for backend code: `backend/config/googleOAuth.js`.

## 7. Troubleshooting

| Error | Fix |
|-------|-----|
| `redirect_uri_mismatch` | Redirect URI in request must exactly match a URI registered in Google Console |
| `access_denied` | User declined consent, or app is in Testing and user is not a test user |
| `invalid_client` | Wrong `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` |
| Missing env at runtime | Ensure `import 'dotenv/config'` runs before reading `process.env` |
