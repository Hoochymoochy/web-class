export function canUsePasswordLogin(user) {
  if (!user) {
    return { allowed: false, error: "Invalid credentials" };
  }

  if (user.authProvider === "GOOGLE" && !user.password) {
    return {
      allowed: false,
      error: "This account uses Google sign-in. Please continue with Google.",
    };
  }

  if (!user.password) {
    return {
      allowed: false,
      error: "Password sign-in is not available for this account.",
    };
  }

  return { allowed: true };
}

export function validateLocalRegistration(existingUser) {
  if (!existingUser) {
    return { allowed: true };
  }

  if (existingUser.authProvider === "GOOGLE" && !existingUser.password) {
    return {
      allowed: false,
      status: 409,
      error:
        "An account with this email already exists via Google. Sign in with Google or link a password from account settings.",
    };
  }

  return {
    allowed: false,
    status: 409,
    error: "An account with this email already exists.",
  };
}

export function canLinkGoogleAccount(existingUser) {
  if (!existingUser) {
    return { allowed: true, action: "create" };
  }

  if (existingUser.googleId) {
    return { allowed: true, action: "login" };
  }

  if (existingUser.authProvider === "LOCAL" && existingUser.password) {
    return { allowed: true, action: "link" };
  }

  return {
    allowed: false,
    error: "Unable to link Google account for this email.",
  };
}
