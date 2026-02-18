const express = require("express");
const app = express();
const port = 3001;

const userRouter = require("./router/user");
const taskRouter = require("./router/task");

app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);


app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
