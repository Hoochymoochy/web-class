import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).send("Token required");
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }

    req.user = user;
    next();
  });
}