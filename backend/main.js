const express = require("express");
const app = express();
const port = 3001;

app.use(express.json());

let tasksData = [
  {
    id: 1,
    title: "Task 1",
    description: "Description 1",
    priority: 1,
    dueDate: "2022-01-01",
    completed: false
  },
  {
    id: 2,
    title: "Task 2",
    description: "Description 2",
    priority: 2,
    dueDate: "2022-02-01",
    completed: true
  },
  {
    id: 3,
    title: "Task 3",
    description: "Description 3",
    priority: 3,
    dueDate: "2022-03-01",
    completed: false
  }
];

app.get("/api/tasks", (req, res) => {
  res.json(tasksData);
});

app.get("/api/tasks/:id", (req, res) => {
  const task = tasksData.find(t => t.id === Number(req.params.id));
  if (!task) return res.sendStatus(404);
  res.json(task);
});

app.post("/api/tasks", (req, res) => {
  const newTask = {
    id: tasksData.length ? Math.max(...tasksData.map(t => t.id)) + 1 : 1,
    ...req.body
  };

  tasksData.push(newTask);
  res.status(201).json(newTask);
});

app.put("/api/tasks/:id", (req, res) => {
  const task = tasksData.find(t => t.id === Number(req.params.id));
  if (!task) return res.sendStatus(404);

  const { title, description, priority, dueDate, completed } = req.body;

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (priority !== undefined) task.priority = priority;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (completed !== undefined) task.completed = completed;

  res.sendStatus(200);
});

app.delete("/api/tasks/:id", (req, res) => {
  const exists = tasksData.some(t => t.id === Number(req.params.id));
  if (!exists) return res.sendStatus(404);

  tasksData = tasksData.filter(t => t.id !== Number(req.params.id));
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
