import express from "express";

import userRouter from "./router/user.js";
import taskRouter from "./router/task.js";
import oauthRouter from "./router/oauth.js";
import teamRouter from "./router/team.js";
import cors from "cors";

import { authenticateToken } from "./jwt/authenticateToken.js";

const app = express();
const port = 3001;

app.use(cors());

app.use(express.json());
app.use("/api/oauth", oauthRouter);
app.use("/api/users", authenticateToken, userRouter);
app.use("/api/tasks", authenticateToken, taskRouter);
app.use("/api/teams", authenticateToken, teamRouter);

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});