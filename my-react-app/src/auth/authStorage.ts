export interface AuthSession {
  token: string;
  userId: string;
  email: string;
  name: string;
}

const TOKEN_KEY = 'token';
const USER_ID_KEY = 'userId';
const EMAIL_KEY = 'email';
const NAME_KEY = 'name';

export function loadSession(): AuthSession | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const userId = localStorage.getItem(USER_ID_KEY);

  if (!token || !userId) {
    return null;
  }

  return {
    token,
    userId,
    email: localStorage.getItem(EMAIL_KEY) ?? '',
    name: localStorage.getItem(NAME_KEY) ?? '',
  };
}

export function saveSession(session: AuthSession): void {
  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(USER_ID_KEY, session.userId);
  localStorage.setItem(EMAIL_KEY, session.email);
  localStorage.setItem(NAME_KEY, session.name);
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(EMAIL_KEY);
  localStorage.removeItem(NAME_KEY);
}
